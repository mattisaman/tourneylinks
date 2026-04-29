import { NextResponse } from 'next/server';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

export const dynamic = 'force-dynamic';

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

// Singleton pattern for the queue to avoid reconnection issues in dev
const globalAny: any = global;

function getDiscoveryQueue() {
  if (!globalAny.discoveryQueue) {
    const connection = new IORedis(redisUrl, { maxRetriesPerRequest: null });
    globalAny.discoveryQueue = new Queue('tournament-discovery', { connection });
  }
  return globalAny.discoveryQueue as Queue;
}

export async function POST(req: Request) {
  try {
    const { regions } = await req.json();

    if (!regions || !Array.isArray(regions)) {
      return NextResponse.json({ error: 'Requires regions array (e.g. ["90210", "Orlando, FL"])' }, { status: 400 });
    }

    const dispatched = [];

    // Fan-out execution: Fire individual BullMQ jobs per region!
    const discoveryQueue = getDiscoveryQueue();
    for (const region of regions) {
      const job = await discoveryQueue.add('discover-region', { region });
      dispatched.push({ region, jobId: job.id });
    }

    return NextResponse.json({
      success: true,
      orchestration: 'BullMQ',
      jobsQueued: dispatched.length,
      details: dispatched
    });

  } catch (error: any) {
    console.error("Queue Dispatch Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
