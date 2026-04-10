import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db, stripe_accounts, tournaments } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_fallback', {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tournamentId, entryFee, cartItems } = body;
    
    // We need the domain to send Stripe back to upon success/cancel
    const headersList = await headers();
    const origin = headersList.get('origin') || 'http://localhost:3000';

    // 1. Validate Tournament & Host connected account
    const tourneyRow = await db.select().from(tournaments).where(eq(tournaments.id, tournamentId)).limit(1);
    if (!tourneyRow.length) {
       return NextResponse.json({ error: 'Tournament not found.' }, { status: 404 });
    }
    const hostUserId = tourneyRow[0].hostUserId;
    
    // Lookup if host has connected Stripe
    const accountRow = await db.select().from(stripe_accounts).where(eq(stripe_accounts.userId, hostUserId)).limit(1);
    const connectedAccountId = accountRow.length > 0 ? accountRow[0].stripeAccountId : null;

    // 2. Build Stripe Line Items
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    
    // Base Entry Fee
    if (entryFee > 0) {
      line_items.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tourneyRow[0].name} - Registration Entry`,
          },
          unit_amount: Math.round(entryFee * 100), // Cents
        },
        quantity: 1,
      });
    }

    // Add-on Cart Items
    if (cartItems && cartItems.length > 0) {
       cartItems.forEach((item: any) => {
          if (item.qty > 0) {
             line_items.push({
               price_data: {
                 currency: 'usd',
                 product_data: { name: item.title },
                 unit_amount: item.price, // API assumption: Add-on prices are already in cents
               },
               quantity: item.qty,
             });
          }
       });
    }

    if (line_items.length === 0) {
       return NextResponse.json({ error: 'Cart is empty or free. Cannot generate Stripe session.' }, { status: 400 });
    }

    // 3. Create Session Payload
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
       payment_method_types: ['card'],
       line_items,
       mode: 'payment',
       success_url: `${origin}/admin/tournaments/${tournamentId}/builder?checkout=success`,
       cancel_url: `${origin}/admin/tournaments/${tournamentId}/builder?checkout=canceled`,
       metadata: {
          tournamentId: tournamentId.toString(),
          type: 'REGISTRATION_CHECKOUT'
       }
    };

    // 4. Inject Stripe Connect parameters if host has connected their account
    if (connectedAccountId) {
       // We calculate a platform fee to take off the top. Example 5% standard.
       // In a real system, you'd calculate total amount in cents and take a %.
       const totalCents = line_items.reduce((acc, item) => acc + (item.price_data?.unit_amount || 0) * (item.quantity || 1), 0);
       const platformFeeCents = Math.round(totalCents * 0.05); // TourneyLinks takes 5%
       
       sessionParams.payment_intent_data = {
          application_fee_amount: platformFeeCents,
       };
    }

    // 5. Generate Stripe Checkout URL
    const session = await stripe.checkout.sessions.create(
       sessionParams,
       connectedAccountId ? { stripeAccount: connectedAccountId } : undefined
    );

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
