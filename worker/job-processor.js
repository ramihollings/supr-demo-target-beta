// Background job processor - MEMORY LEAK (Issue #1)
const completedJobs = []; // BUG: Never cleared - grows indefinitely

async function processJobs(queue) {
  while (true) {
    const job = await queue.dequeue();
    if (!job) {
      await sleep(1000);
      continue;
    }

    try {
      const result = await executeJob(job);
      
      // BUG: Pushing to completedJobs without any eviction
      // Memory grows without bound under production load
      completedJobs.push({ id: job.id, result, completedAt: Date.now() });
      
      await queue.acknowledge(job.id);
    } catch (err) {
      console.error(`Job ${job.id} failed:`, err);
      await queue.nack(job.id);
    }
  }
}

async function executeJob(job) {
  switch (job.type) {
    case 'send_invoice': return await sendInvoice(job.payload);
    case 'charge_card':  return await chargeCard(job.payload);
    case 'send_email':   return await sendEmail(job.payload);
    default: throw new Error(`Unknown job type: ${job.type}`);
  }
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = { processJobs, completedJobs };
