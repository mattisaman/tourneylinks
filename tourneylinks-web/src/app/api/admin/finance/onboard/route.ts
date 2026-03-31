import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db, users, stripe_accounts } from '@/lib/db';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(req: Request) {
  try {
     const clerkUser = await currentUser();
     if (!clerkUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

     const dbUserRow = await db.select().from(users).where(eq(users.clerkId, clerkUser.id)).limit(1);
     const dbUser = dbUserRow[0];
     if (!dbUser) return NextResponse.json({ error: 'User mapping failed' }, { status: 404 });

     // Step 1: Does this user already have an active Stripe Account linked?
     const accountRow = await db.select().from(stripe_accounts).where(eq(stripe_accounts.userId, dbUser.id)).limit(1);
     let connectAccountId = accountRow.length > 0 ? accountRow[0].stripeAccountId : null;

     // Step 2: Mint a new Standard Stripe Connect account if one doesn't exist
     if (!connectAccountId) {
         const account = await stripe.accounts.create({
            type: 'standard', // 'standard' allows the organizer full native control of their Stripe Dashboard
            email: dbUser.email,
         });
         
         connectAccountId = account.id;

         // Persist this exact link down to the PostgreSQL database mapping
         await db.insert(stripe_accounts).values({
            userId: dbUser.id,
            stripeAccountId: connectAccountId,
            payoutsEnabled: false,
            chargesEnabled: false,
         });
     }

     // Step 3: Mint the highly-secure temporary Onboarding Link payload
     const accountLink = await stripe.accountLinks.create({
         account: connectAccountId,
         refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/admin`,
         return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/admin?onboard=success`,
         type: 'account_onboarding',
     });

     // Push the secure routing URL strictly back to the client UI
     return NextResponse.json({ url: accountLink.url });

  } catch(err: any) {
     console.error('Stripe Onboarding Mint Error:', err);
     return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
