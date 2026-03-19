import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db, stripe_accounts, tournaments, users } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in to register.' }, { status: 401 });
    }

    const { tournamentId } = await req.json();
    if (!tournamentId) {
      return NextResponse.json({ error: 'Missing tournament ID' }, { status: 400 });
    }

    // Retrieve internal user
    const dbUserRow = await db.select().from(users).where(eq(users.clerkId, clerkUser.id)).limit(1);
    const dbUser = dbUserRow[0];
    if (!dbUser) return NextResponse.json({ error: 'User profile not synchronized' }, { status: 404 });

    // Retrieve Tournament
    const tourneyRow = await db.select().from(tournaments).where(eq(tournaments.id, tournamentId)).limit(1);
    const tournament = tourneyRow[0];
    if (!tournament) return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });

    // Safety checks
    if (!tournament.entryFee || tournament.entryFee <= 0) {
       return NextResponse.json({ error: 'This tournament is free or missing an entry fee.' }, { status: 400 });
    }
    if (!tournament.hostUserId) {
       return NextResponse.json({ error: 'This tournament has not been claimed by a Host yet.' }, { status: 400 });
    }

    // Retrieve Host's Stripe Account
    const hostStripeRow = await db.select()
      .from(stripe_accounts)
      .where(eq(stripe_accounts.userId, tournament.hostUserId))
      .limit(1);
    const hostStripe = hostStripeRow[0];

    if (!hostStripe || !hostStripe.chargesEnabled || !hostStripe.stripeAccountId) {
       return NextResponse.json({ error: 'The Tournament Director has not finished setting up payments.' }, { status: 400 });
    }

    // Financial Calculation (Cents)
    // TourneyLinks takes 2% Platform Fee
    const rawEntryFeeCents = Math.round(tournament.entryFee * 100);
    const platformFeePercentage = 0.02; 
    const applicationFeeAmountCents = Math.round(rawEntryFeeCents * platformFeePercentage);

    // Provide Checkout Session
    const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    // We pass metadata to construct the internal Registration record in the Webhook
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Registration: ${tournament.name}`,
              description: `${tournament.format} at ${tournament.courseName}`,
              // images: [tournament.imageUrl] -> optional
            },
            unit_amount: rawEntryFeeCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/tournaments/${tournament.id}?registration=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/tournaments/${tournament.id}?registration=cancelled`,
      payment_intent_data: {
        application_fee_amount: applicationFeeAmountCents,
        transfer_data: {
          destination: hostStripe.stripeAccountId,
        },
      },
      metadata: {
        tournamentId: tournament.id.toString(),
        userId: dbUser.id.toString(),
        registrationType: 'PLAYER', // Future extension for Teams
      },
      customer_email: clerkUser.emailAddresses[0]?.emailAddress,
    });

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error('Stripe Checkout Creation Failed:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
