import React from 'react';
import { db, stripe_accounts, users } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth-util';
import { redirect } from 'next/navigation';
import StripeOnboardButton from './StripeOnboardButton';

export default async function HostOnboardingPage() {
  const clerkUser = await getCurrentUser();
  if (!clerkUser) {
    redirect('/sign-in');
  }

  // Retrieve user
  const dbUserRow = await db.select().from(users).where(eq(users.clerkId, clerkUser.id)).limit(1);
  const dbUser = dbUserRow[0];

  if (!dbUser) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h2>User Account Error</h2>
        <p>Please log out and log back in to sync your profile.</p>
      </div>
    );
  }

  // Check if they already have an active Stripe account
  const accountRow = await db.select().from(stripe_accounts).where(eq(stripe_accounts.userId, dbUser.id)).limit(1);
  const existingAccount = accountRow[0];

  if (existingAccount && existingAccount.chargesEnabled && existingAccount.payoutsEnabled) {
    // If fully onboarded, shoot them straight to the Host Dashboard
    redirect('/host/dashboard');
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--sage)', padding: '6rem 2rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', background: 'var(--white)', padding: '3rem', borderRadius: 'var(--radius-lg)', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏦</div>
        <h1 style={{ color: 'var(--forest)', fontSize: '2rem', fontFamily: 'Playfair Display, serif', marginBottom: '1rem' }}>Host Financial Setup</h1>
        
        <p style={{ color: 'var(--mist)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
          To securely collect entry fees and manage payouts for your tournaments, TourneyLinks partners with <strong>Stripe</strong>. 
          Stripe handles the strict KYC requirements and bank routing natively so you can get paid safely and instantly.
        </p>

        {existingAccount && (!existingAccount.chargesEnabled || !existingAccount.payoutsEnabled) ? (
          <div style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.4)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2.5rem' }}>
            <h3 style={{ color: '#8a6e1c', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Onboarding Incomplete</h3>
            <p style={{ color: 'var(--ink)', fontSize: '0.9rem' }}>It looks like you started the Stripe setup but didn't finish. Please click below to resume your application.</p>
          </div>
        ) : null}

        <StripeOnboardButton />
        
        <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: 'var(--mist)', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1.5rem' }}>
          By clicking the button above, you will be securely redirected to Stripe's managed onboarding portal. TourneyLinks does not hold custody of your financial or banking data.
        </div>
      </div>
    </div>
  );
}
