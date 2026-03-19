import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db, stripe_accounts, users } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Step 1: Retrieve the internal User ID
    const dbUserRow = await db.select().from(users).where(eq(users.clerkId, clerkUser.id)).limit(1);
    const dbUser = dbUserRow[0];

    if (!dbUser) {
      return NextResponse.json({ error: 'User mapping not found' }, { status: 404 });
    }

    // Step 2: Check if this user already has a Stripe Connect Account
    const accountRow = await db.select().from(stripe_accounts).where(eq(stripe_accounts.userId, dbUser.id)).limit(1);
    let stripeAccountId = accountRow[0]?.stripeAccountId;

    // Step 3: If no account exists, construct a new one via Stripe Connect API
    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: 'express', // Express gives TourneyLinks platform control but hands Stripe the heavy KYC/compliance UI
        country: 'US',
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'individual',
      });

      stripeAccountId = account.id;

      // Save the binding correlation softly in our DB (payouts enabled is false until verified)
      await db.insert(stripe_accounts).values({
        userId: dbUser.id,
        stripeAccountId: stripeAccountId,
      });
    }

    // Step 4: Generate an Onboarding secure Link
    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/host/dashboard?stripe_onboarded=true`;
    const refreshUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/host/dashboard`;

    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: 'account_onboarding',
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error: any) {
    console.error('Stripe Account Link generation failed:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
