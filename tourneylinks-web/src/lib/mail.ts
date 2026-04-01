import { Resend } from 'resend';

// Provide a structural fallback during Vercel static build evaluation
const apiKey = process.env.RESEND_API_KEY || 're_sandbox_development';

export const resend = new Resend(apiKey);

export const DEFAULT_FROM_ADDRESS = 'TourneyLinks System <notifications@tourneylinks.com>';
