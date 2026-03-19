import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db, tournaments, stripe_accounts } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const { tournamentId, amount, donorName, donorEmail } = await req.json();

    if (!tournamentId || !amount || amount < 5) {
      return NextResponse.json({ error: 'Invalid donation parameters' }, { status: 400 });
    }

    const tId = parseInt(tournamentId, 10);
    const tournamentData = await db.select().from(tournaments).where(eq(tournaments.id, tId)).limit(1);
    const tournament = tournamentData[0];

    if (!tournament) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
    }

    // Is Host Connected to Stripe Connect?
    let destinationStripeAccountId: string | null = null;
    if (tournament.hostUserId) {
      const hostStripe = await db.select().from(stripe_accounts).where(eq(stripe_accounts.userId, tournament.hostUserId)).limit(1);
      if (hostStripe[0]?.chargesEnabled && hostStripe[0]?.stripeAccountId) {
        destinationStripeAccountId = hostStripe[0].stripeAccountId;
      }
    }

    if (!destinationStripeAccountId) {
      return NextResponse.json({ error: 'This tournament is not actively configured to receive payments via Stripe Connect.' }, { status: 400 });
    }

    // Ensure application fee logic (We take 2% or $0 on donations?)
    // User requirement: Monetization. We will take a 1% standard processing platform fee on donations to cover infrastructure, or up to 2%. Let's set 2% to align with regular entry fees.
    const amountCents = amount * 100;
    const applicationFeeAmountCents = Math.round(amountCents * 0.02);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'link', 'us_bank_account'], // Enables Apple Pay / Google Pay / ACH automatically
      mode: 'payment',
      customer_email: donorEmail,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Charitable Donation to ${tournament.charityName || 'Cause'}`,
              description: `A direct donation supporting ${tournament.name}. Donor: ${donorName}`,
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      ...(destinationStripeAccountId.includes('Mock') ? {} : {
        payment_intent_data: {
          application_fee_amount: applicationFeeAmountCents,
          transfer_data: {
            destination: destinationStripeAccountId,
          },
        }
      }),
      metadata: {
        tournamentId: tId.toString(),
        type: 'DONATION',
        donorName
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/tournaments/${tId}?success=donation`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/tournaments/${tId}/donate`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Donation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
