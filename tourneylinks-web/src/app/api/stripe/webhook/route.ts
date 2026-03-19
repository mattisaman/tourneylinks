import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db, registrations, payments, tournaments, users, tournament_sponsors } from '@/lib/db';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('Stripe-Signature') as string;

  let stripeEvent: Stripe.Event;

  try {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) throw new Error('STRIPE_WEBHOOK_SECRET missing in environment');
    
    stripeEvent = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (error: any) {
    console.error(`Webhook Signature Verification Failed.`, error.message);
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
  }

  try {
    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object as Stripe.Checkout.Session;

      // Extract metadata
      const type = session.metadata?.type || 'REGISTRATION';
      const tournamentIdStr = session.metadata?.tournamentId;
      
      if (!tournamentIdStr) {
         console.warn("⚠️ Stripe Webhook handled a checkout session missing Tournament metadata.");
         return NextResponse.json({ received: true });
      }

      const tournamentId = parseInt(tournamentIdStr, 10);

      // Verify the tournament exists
      const tourneyData = await db.select().from(tournaments).where(eq(tournaments.id, tournamentId)).limit(1);
      if (!tourneyData[0]) {
         console.error("Webhook Error: Tournament not found linking to payment");
         return NextResponse.json({ received: true }); 
      }

      // BRANCH 1: SPONSORSHIPS
      if (type === 'SPONSORSHIP') {
        const companyName = session.metadata?.companyName || 'Anonymous Sponsor';
        const logoUrl = session.metadata?.logoUrl || '';
        const websiteUrl = session.metadata?.websiteUrl || '';
        
        await db.insert(tournament_sponsors).values({
          tournamentId,
          name: companyName,
          logoUrl,
          websiteUrl
        });

        console.log(`✅ [Webhook] Sponsorship fulfilled for ${companyName} into Tournament ${tournamentId}`);
        return NextResponse.json({ received: true });
      }

      // BRANCH 2: DONATIONS
      if (type === 'DONATION') {
        const donorName = session.metadata?.donorName || 'Anonymous';
        console.log(`✅ [Webhook] Donation of ${session.amount_total} fulfilled from ${donorName} into Tournament ${tournamentId}`);
        // Donations go straight to the connected Stripe account. No DB ledger insertion required for Phase 11 MVP.
        return NextResponse.json({ received: true });
      }

      // BRANCH 3: STANDARD REGISTRATIONS (Default)
      // BRANCH 3: STANDARD REGISTRATIONS & NEW Foursome Split Engine
      if (type === 'PLAYER' || type === 'TEAM_CLAIM') {
        const userIdStr = session.metadata?.userId;
        if (!userIdStr) {
           console.warn("⚠️ Webhook Registration missing User metadata.");
           return NextResponse.json({ received: true });
        }
        
        const userId = parseInt(userIdStr, 10);

        // Verify the user exists to extract Player details
        const userData = await db.select().from(users).where(eq(users.id, userId)).limit(1);
        const user = userData[0];
        if (!user) {
           console.error("Webhook Error: User not found linking to payment");
           return NextResponse.json({ received: true });
        }

        // 1. Create the base Registration Record
        const { registrations, payments, team_groups, split_invites } = await import('@/lib/db');
        const newRegistration = await db.insert(registrations).values({
          tournamentId,
          userId,
          name: user.fullName || 'Unknown Player',
          email: user.email,
          handicap: user.handicapIndex ?? null,
          status: 'CONFIRMED'
        }).returning({ id: registrations.id });

        const registrationId = newRegistration[0].id;

        // SCENARIO 3A: CAPTAIN / SOLO REGISTRATION
        if (type === 'PLAYER') {
          const pCount = parseInt(session.metadata?.playerCount || '1', 10);
          const pMode = session.metadata?.paymentMode || 'full';
          
          if (pCount > 1) {
            // Initiate the Umbrella Group Structure
            const newGroup = await db.insert(team_groups).values({
              tournamentId,
              captainRegistrationId: registrationId,
              groupName: `${user.fullName.split(' ')[0]}'s Team`,
              totalSpots: pCount,
              spotsFilled: pMode === 'full' ? pCount : 1,
              status: pMode === 'full' ? 'COMPLETED' : 'PENDING'
            }).returning({ id: team_groups.id });

            const teamGroupId = newGroup[0].id;

            // Link the Captain back to their New Team
            await db.update(registrations).set({ teamGroupId }).where(eq(registrations.id, registrationId));

            if (pMode === 'split') {
              // Generate the Secure Claim Constraints (Magic Links)
              const crypto = require('crypto');
              const invites = Array.from({ length: pCount - 1 }).map(() => ({
                teamGroupId,
                token: crypto.randomUUID(),
                status: 'PENDING'
              }));
              await db.insert(split_invites).values(invites);
              console.log(`✅ [Webhook] Foursome Split Activated! Team ${teamGroupId} generated ${invites.length} pending secure links.`);
            }
          }
        }

        // SCENARIO 3B: TEAMMATE CLAIM LINK INGESTION
        if (type === 'TEAM_CLAIM') {
          const teamGroupIdStr = session.metadata?.teamGroupId;
          const token = session.metadata?.token;
          
          if (!teamGroupIdStr || !token) {
             console.error("Webhook Error: TEAM_CLAIM missing teamGroupId or token metadata");
             return NextResponse.json({ received: true });
          }
          
          const teamGroupId = parseInt(teamGroupIdStr, 10);

          await db.update(registrations).set({ teamGroupId }).where(eq(registrations.id, registrationId));
          
          // Invalidate the Token so nobody else can steal the spot
          await db.update(split_invites).set({ status: 'CLAIMED' }).where(eq(split_invites.token, token));

          // Increment the overall Umbrella spotsFilled directly
          // We fetch the latest count safely
          const tgRow = await db.select().from(team_groups).where(eq(team_groups.id, teamGroupId)).limit(1);
          if (tgRow[0]) {
             const newTotal = tgRow[0].spotsFilled + 1;
             await db.update(team_groups).set({ 
               spotsFilled: newTotal,
               status: newTotal >= tgRow[0].totalSpots ? 'COMPLETED' : 'PENDING' 
             }).where(eq(team_groups.id, teamGroupId));
          }
          console.log(`✅ [Webhook] Teammate Claim Fulfilled! Token ${token} redeemed for Team ${teamGroupId}.`);
        }

        // FINALIZE: Compute Platform Ledger Math
        const amountTotalCents = session.amount_total || 0;
        const applicationFeeAmountCents = session.payment_intent 
          ? Math.round(amountTotalCents * 0.02) 
          : 0;

        await db.insert(payments).values({
          registrationId,
          stripeSessionId: session.id,
          stripePaymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : null,
          amount: amountTotalCents,
          platformFee: applicationFeeAmountCents,
          status: 'SUCCEEDED'
        });

        console.log(`✅ [Webhook] Registration sequence successfully closed for User ${userId}.`);
      }
    } // Closes `if (stripeEvent.type === 'checkout.session.completed')`

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error(`🚨 [Webhook] Registration Fulfillment Engine crashed:`, error);
    return NextResponse.json({ error: 'Fulfillment Error' }, { status: 500 });
  }
}
