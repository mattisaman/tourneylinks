import { NextResponse } from 'next/server';
import { Client } from '@upstash/qstash';

export const dynamic = 'force-dynamic';

const qstash = new Client({ token: process.env.QSTASH_TOKEN! });

export async function POST(req: Request) {
  try {
    const { regions } = await req.json();

    if (!regions || !Array.isArray(regions)) {
      return NextResponse.json({ error: 'Requires regions array (e.g. ["90210", "Orlando, FL"])' }, { status: 400 });
    }

    // Identify absolute URL of this server to pass to QStash so it knows where the worker is.
    // In production, you would hardcode or read process.env.NEXT_PUBLIC_SITE_URL
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const host = req.headers.get('host');
    const workerUrl = `${protocol}://${host}/api/spider/worker`;

    const dispatched = [];

    // Fan-out execution: Fire individual stateless QStash jobs per region!
    for (const region of regions) {
      // Fire 'Golf Scramble' per region
      let msg1 = await qstash.publishJSON({
        url: workerUrl,
        body: { query: `Golf Scramble ${region}`, region },
        retries: 3, // Auto-retry 3 times
      });
      
      // Fire 'Charity Golf Tournament' per region
      let msg2 = await qstash.publishJSON({
        url: workerUrl,
        body: { query: `Charity Golf Tournaments ${region}`, region },
        retries: 3,
      });

      dispatched.push({ region, messages: [msg1.messageId, msg2.messageId] });
    }

    return NextResponse.json({
      success: true,
      orchestration: 'Upstash QStash',
      jobsQueued: dispatched.length * 2,
      details: dispatched
    });

  } catch (error: any) {
    console.error("Queue Dispatch Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
