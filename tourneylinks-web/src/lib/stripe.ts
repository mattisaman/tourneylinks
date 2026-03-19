import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  // In a real production app without the env, this throws.
  // For safety in our dev sandbox, we can bypass strictly throwing instantly
  // so the build doesn't crash on boot if the key isn't provided yet.
  console.warn('⚠️ STRIPE_SECRET_KEY is missing from .env.local');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2023-10-16' as any, // Using stable SDK casting mapping
  typescript: true,
});
