import { Router } from 'express';
import { webhookController } from '../controllers/webhookController';

const router = Router();

// GitHub webhook endpoint
router.post('/github', webhookController.handleGitHubWebhook.bind(webhookController));

// GitLab webhook endpoint
router.post('/gitlab', webhookController.handleGitLabWebhook.bind(webhookController));

// Bitbucket webhook endpoint
router.post('/bitbucket', webhookController.handleBitbucketWebhook.bind(webhookController));

export default router;
