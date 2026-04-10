import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db, payments, registrations } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_fallback', {
  apiVersion: '2025-02-24.acacia',
});

// Notice: In production, you strictly need process.env.STRIPE_WEBHOOK_SECRET locally or in Vercel to secure this.
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = (await headers()).get('stripe-signature');

    let event: Stripe.Event;

    // 1. Signature Verification Bypass Logic
    // If we are in dev and missing a secret, we parse it directly. 
    // WARNING: In production, failing verification must block execution.
    if (!webhookSecret || !signature) {
       console.warn('⚠️ Stripe Webhook running without signature verification (Missing Secret or Signature).');
       event = JSON.parse(body);
    } else {
       try {
         event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
       } catch (err: any) {
         console.error('⚠️ Webhook signature verification failed:', err.message);
         return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
       }
    }

    // 2. Handle specific Stripe Checkout Events
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        const stripeSessionId = session.id;

        // In a live system where the Checkout POST route physically tracks `payments` rows, 
        // we flip the boolean here:
        if (session.metadata?.type === 'REGISTRATION_CHECKOUT') {
           console.log(`✅ Webhook: Registration Payment Confirmed for Session ${stripeSessionId}`);
           // E.g., await db.update(payments).set({ status: 'SUCCEEDED' }).where(eq(payments.stripeSessionId, stripeSessionId));
           // For the MVP Campaign Builder simulator, we just log success.
        }
        break;
        
      default:
        // Ignoring other events safely.
        break;
    }

    return NextResponse.json({ received: true });
    
  } catch (err: any) {
    console.error('Webhook routing crashed:', err.message);
    return NextResponse.json({ error: 'Webhook handler failed.' }, { status: 500 });
  }
}
