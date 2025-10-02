import express from 'express';
import { clerkWebhookHandler } from '../controllers/webhookController.js';

const router = express.Router();

// Webhook route for Clerk user events
router.post('/clerk', clerkWebhookHandler);

export default router;