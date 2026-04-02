// src/lib/auth-util.ts
// Intelligent wrapper to completely trick the application into adopting a logged-in state when in Demo mode.

import { auth, currentUser } from '@clerk/nextjs/server';

export async function getUserId() {
    if (process.env.NEXT_PUBLIC_IS_DEMO === 'true') {
        return { userId: 'demo-host-123' }; // Matches the precise Master Pro host seeded during /api/demo/reset
    }
    const session = await auth();
    return session;
}

export async function getCurrentUser() {
    if (process.env.NEXT_PUBLIC_IS_DEMO === 'true') {
        return {
            id: 'demo-host-123',
            emailAddresses: [{ emailAddress: 'host@demo.tourneylinks.com' }],
            primaryEmailAddressId: 'mock-1',
            firstName: 'Demo',
            lastName: 'Pro',
            imageUrl: 'https://images.unsplash.com/photo-1533227260815-46543b35eb65?q=80&w=2670&auto=format&fit=crop',
        };
    }
    return currentUser();
}
