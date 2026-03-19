import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db, tournaments, stripe_accounts, sponsorship_tiers } from '@/lib/db';
import { eq, and } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const { tournamentId, tierId, amount, companyName, contactEmail, websiteUrl, logoUrl } = await req.json();

    if (!tournamentId || !tierId || !amount || !companyName || !contactEmail) {
      return NextResponse.json({ error: 'Missing required sponsorship parameters' }, { status: 400 });
    }

    const tId = parseInt(tournamentId, 10);
    const tierIdInt = parseInt(tierId, 10);

    const tournamentData = await db.select().from(tournaments).where(eq(tournaments.id, tId)).limit(1);
    const tournament = tournamentData[0];

    if (!tournament) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
    }

    // Verify the Tier matches the database (prevent price tampering)
    const tierData = await db.select().from(sponsorship_tiers).where(and(eq(sponsorship_tiers.id, tierIdInt), eq(sponsorship_tiers.tournamentId, tId))).limit(1);
    const tier = tierData[0];
    if (!tier || tier.price !== amount) {
      return NextResponse.json({ error: 'Sponsorship tier validation failed' }, { status: 400 });
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

    const amountCents = amount * 100;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'link', 'us_bank_account'],
      mode: 'payment',
      customer_email: contactEmail,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Sponsorship: ${tier.name}`,
              description: `Brand: ${companyName}. Event: ${tournament.name}`,
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      ...(destinationStripeAccountId.includes('Mock') ? {} : {
        payment_intent_data: {
          transfer_data: {
            destination: destinationStripeAccountId,
          },
        }
      }),
      metadata: {
        tournamentId: tId.toString(),
        type: 'SPONSORSHIP',
        tierId: tierIdInt.toString(),
        companyName,
        websiteUrl: websiteUrl || '',
        logoUrl: logoUrl || ''
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/tournaments/${tId}?success=sponsorship`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/tournaments/${tId}/sponsor`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Sponsorship Target Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
