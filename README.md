# supr-demo-target-beta

A Node.js background worker service for billing and job processing.

## Issues

### Issue #1: Fix Memory Leak in Background Worker
The `processJobs` loop in `worker/job-processor.js` holds references to completed job objects
indefinitely. Under load, the process grows to 2GB+ RAM and crashes.

Root cause: `completedJobs` array is never cleared. Fix by implementing a bounded cache
with a 1000-item LRU eviction policy.

### Issue #2: Add Unit Tests for Billing Service
The `billing/charge.js` module has 0% test coverage. Add Jest unit tests for:
- `calculateProration()`
- `applyDiscount()`
- `generateInvoice()`
