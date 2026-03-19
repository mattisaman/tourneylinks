import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db, registrations, payments, tournaments, users } from '@/lib/db';
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

      // Ensure this is a registration checkout and extract metadata
      const tournamentIdStr = session.metadata?.tournamentId;
      const userIdStr = session.metadata?.userId;

      if (!tournamentIdStr || !userIdStr) {
         console.warn("⚠️ Stripe Webhook handled a checkout session missing Tournament/User metadata.");
         return NextResponse.json({ received: true });
      }

      const tournamentId = parseInt(tournamentIdStr, 10);
      const userId = parseInt(userIdStr, 10);

      // Verify the tournament exists
      const tourneyData = await db.select().from(tournaments).where(eq(tournaments.id, tournamentId)).limit(1);
      if (!tourneyData[0]) {
         console.error("Webhook Error: Tournament not found linking to payment");
         return NextResponse.json({ received: true }); 
      }

      // Verify the user exists to extract Player details
      const userData = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      const user = userData[0];
      if (!user) {
         console.error("Webhook Error: User not found linking to payment");
         return NextResponse.json({ received: true });
      }

      // 1. Create the Registration Record
      const newRegistration = await db.insert(registrations).values({
        tournamentId,
        userId,
        playerName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown Player',
        playerEmail: user.email,
        playerPhone: null,
        playerHandicapIndex: user.ghinHandicap, // Pull global GHIN if available
        status: 'CONFIRMED'
      }).returning({ id: registrations.id });

      const registrationId = newRegistration[0].id;

      // 2. Compute Financial Tracking
      // Stripe amount_total is the raw Entry Fee
      const amountTotalCents = session.amount_total || 0;
      
      // We extract Platform Fee details from the Payment Intent if available
      // The session created previously set a 2% platform fee application_fee_amount
      const applicationFeeAmountCents = session.payment_intent 
        ? Math.round(amountTotalCents * 0.02) 
        : 0;

      // 3. Create the Payments Record Ledger
      await db.insert(payments).values({
        registrationId,
        stripeSessionId: session.id,
        stripePaymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : null,
        amount: amountTotalCents,
        platformFee: applicationFeeAmountCents,
        status: 'SUCCEEDED'
      });

      console.log(`✅ [Webhook] Registration fulfilled for User ${userId} into Tournament ${tournamentId}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error(`🚨 [Webhook] Registration Fulfillment Engine crashed:`, error);
    return NextResponse.json({ error: 'Fulfillment Error' }, { status: 500 });
  }
}
