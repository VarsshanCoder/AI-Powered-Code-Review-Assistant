"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const webhookController_1 = require("../controllers/webhookController");
const router = (0, express_1.Router)();
// GitHub webhook endpoint
router.post('/github', webhookController_1.webhookController.handleGitHubWebhook.bind(webhookController_1.webhookController));
// GitLab webhook endpoint
router.post('/gitlab', webhookController_1.webhookController.handleGitLabWebhook.bind(webhookController_1.webhookController));
// Bitbucket webhook endpoint
router.post('/bitbucket', webhookController_1.webhookController.handleBitbucketWebhook.bind(webhookController_1.webhookController));
exports.default = router;
//# sourceMappingURL=webhook.js.map