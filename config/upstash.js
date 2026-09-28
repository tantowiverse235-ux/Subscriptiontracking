import { Client as WorkflowClient } from '@upstash/workflow';
import { QSTASH_TOKEN, QSTASH_URL } from './env.js';

// When QSTASH_DEV=true the SDK auto-downloads and connects to a local
// QStash dev server — no real token or URL needed.
// In production, QSTASH_URL and QSTASH_TOKEN from the environment are used.
export const workflowClient = new WorkflowClient({
    baseUrl: QSTASH_URL,
    token: QSTASH_TOKEN,
});
