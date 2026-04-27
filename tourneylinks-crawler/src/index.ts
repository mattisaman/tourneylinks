import 'dotenv/config';
import { CronJob } from 'cron';
import pino from 'pino';
import { runCrawlCycle } from './pipeline/orchestrator.js';
import { extractionQueue, extractionWorker } from './pipeline/queue.js';
import { Worker } from 'bullmq';
const logger = pino({
  name: 'tourneylinks-crawler',
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true },
  },
});

// ===========================================
// TEETIME TOURNAMENT CRAWLER
// Entry point — run manually or on a schedule
// ===========================================

async function main() {
  const args = process.argv.slice(2);

  logger.info('╔════════════════════════════════════════╗');
  logger.info('║  TourneyLinks Tournament Discovery Agent    ║');
  logger.info('║  v1.0.0                                ║');
  logger.info('╚════════════════════════════════════════╝');

  // ─── Run a single crawl cycle ───
  if (args.includes('--run-cycle')) {
    logger.info('Running single crawl cycle (enqueueing)...');
    const stats = await runCrawlCycle();
    logger.info({ stats }, 'Cycle enqueued. Waiting for extraction queue to drain...');
    
    // Wait for queue to drain
    while (true) {
      const counts = await extractionQueue.getJobCounts('wait', 'active', 'delayed');
      if (counts.wait === 0 && counts.active === 0 && counts.delayed === 0) {
        break;
      }
      await new Promise(r => setTimeout(r, 5000));
    }
    
    logger.info('Extraction queue drained. Cycle complete. Exiting.');
    process.exit(0);
  }

  // ─── Run for a specific source only ───
  if (args.includes('--source')) {
    const sourceIdx = args.indexOf('--source');
    const sourceId = args[sourceIdx + 1];
    if (!sourceId) {
      logger.error('Usage: --source <source-id>');
      process.exit(1);
    }
    logger.info({ source: sourceId }, 'Running single-source crawl (enqueueing)...');
    const stats = await runCrawlCycle(sourceId);
    logger.info({ stats }, 'Source crawl enqueued. Waiting for extraction queue to drain...');
    
    // Wait for queue to drain
    while (true) {
      const counts = await extractionQueue.getJobCounts('wait', 'active', 'delayed');
      if (counts.wait === 0 && counts.active === 0 && counts.delayed === 0) {
        break;
      }
      await new Promise(r => setTimeout(r, 5000));
    }
    
    logger.info('Extraction queue drained. Source crawl complete. Exiting.');
    process.exit(0);
  }

  // ─── Scheduled mode (default) ───
  const schedule = process.env.CRAWL_SCHEDULE || '0 */6 * * *';
  logger.info({ schedule }, 'Starting in scheduled mode');

  // Run immediately on start
  logger.info('Running initial crawl cycle...');
  await runCrawlCycle();

  // Then schedule recurring cycles
  const job = new CronJob(
    schedule,
    async () => {
      logger.info('Scheduled crawl cycle starting...');
      try {
        await runCrawlCycle();
      } catch (error) {
        logger.error({ error: String(error) }, 'Scheduled crawl cycle failed');
      }
    },
    null, // onComplete
    true, // start
    'America/New_York',
  );

  logger.info({ nextRun: job.nextDate().toISO() }, 'Next scheduled crawl');

  // ─── Listen for Web App Dashboard Triggers ───
  logger.info('Listening for external triggers on [tournament-discovery] queue...');
  const discoveryWorker = new Worker('tournament-discovery', async (bullJob) => {
    logger.info({ job: bullJob.name, data: bullJob.data }, 'Received remote trigger from Admin Dashboard');
    if (bullJob.name === 'discover-region' || bullJob.name === 'run-cycle') {
      try {
        await runCrawlCycle();
      } catch (error) {
        logger.error({ error: String(error) }, 'Triggered crawl cycle failed');
      }
    }
  }, { connection: extractionQueue.opts.connection as any });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    logger.info('Shutting down gracefully...');
    job.stop();
    await discoveryWorker.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    logger.info('Received SIGTERM — shutting down...');
    job.stop();
    await discoveryWorker.close();
    process.exit(0);
  });
}

main().catch(error => {
  logger.fatal({ error: String(error) }, 'Fatal error');
  process.exit(1);
});
