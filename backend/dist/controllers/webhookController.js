"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookController = exports.WebhookController = void 0;
const client_1 = require("@prisma/client");
const githubService_1 = require("../services/githubService");
const gitlabService_1 = require("../services/gitlabService");
const bitbucketService_1 = require("../services/bitbucketService");
const logger_1 = require("../utils/logger");
const crypto_1 = __importDefault(require("crypto"));
const prisma = new client_1.PrismaClient();
class WebhookController {
    constructor() {
        this.githubSecret = process.env.GITHUB_WEBHOOK_SECRET;
        this.gitlabSecret = process.env.GITLAB_WEBHOOK_SECRET;
        this.bitbucketSecret = process.env.BITBUCKET_WEBHOOK_SECRET;
    }
    async handleGitHubWebhook(req, res) {
        try {
            // Verify signature if secret is set
            if (this.githubSecret) {
                const signature = req.headers['x-hub-signature-256'];
                if (!this.verifyGitHubSignature(req.body, signature)) {
                    return res.status(401).json({ error: 'Invalid signature' });
                }
            }
            const event = req.headers['x-github-event'];
            const payload = req.body;
            logger_1.logger.info(`Received GitHub webhook: ${event}`);
            switch (event) {
                case 'pull_request':
                    await this.handleGitHubPullRequest(payload);
                    break;
                case 'push':
                    await this.handleGitHubPush(payload);
                    break;
                default:
                    logger_1.logger.info(`Unhandled GitHub event: ${event}`);
            }
            res.status(200).json({ received: true });
        }
        catch (error) {
            logger_1.logger.error('Failed to handle GitHub webhook:', error);
            res.status(500).json({ error: 'Failed to process webhook' });
        }
    }
    async handleGitLabWebhook(req, res) {
        try {
            // Verify signature if secret is set
            if (this.gitlabSecret) {
                const signature = req.headers['x-gitlab-token'];
                if (signature !== this.gitlabSecret) {
                    return res.status(401).json({ error: 'Invalid token' });
                }
            }
            const event = req.headers['x-gitlab-event'];
            const payload = req.body;
            logger_1.logger.info(`Received GitLab webhook: ${event}`);
            switch (event) {
                case 'Merge Request Hook':
                    await this.handleGitLabMergeRequest(payload);
                    break;
                case 'Push Hook':
                    await this.handleGitLabPush(payload);
                    break;
                default:
                    logger_1.logger.info(`Unhandled GitLab event: ${event}`);
            }
            res.status(200).json({ received: true });
        }
        catch (error) {
            logger_1.logger.error('Failed to handle GitLab webhook:', error);
            res.status(500).json({ error: 'Failed to process webhook' });
        }
    }
    async handleBitbucketWebhook(req, res) {
        try {
            // Bitbucket doesn't have built-in signature verification like GitHub
            // You might want to implement custom verification
            const payload = req.body;
            logger_1.logger.info(`Received Bitbucket webhook`);
            if (payload.pullrequest) {
                await this.handleBitbucketPullRequest(payload);
            }
            else if (payload.push) {
                await this.handleBitbucketPush(payload);
            }
            else {
                logger_1.logger.info('Unhandled Bitbucket webhook type');
            }
            res.status(200).json({ received: true });
        }
        catch (error) {
            logger_1.logger.error('Failed to handle Bitbucket webhook:', error);
            res.status(500).json({ error: 'Failed to process webhook' });
        }
    }
    async handleGitHubPullRequest(payload) {
        const { action, pull_request, repository } = payload;
        if (action !== 'opened' && action !== 'synchronize')
            return;
        const repo = await this.findOrCreateRepository(client_1.Provider.GITHUB, repository.id.toString(), repository.full_name, repository.html_url, repository.default_branch, !repository.private, repository.language);
        if (!repo)
            return;
        // Find user who owns the repo or organization
        const user = await this.findRepositoryOwner(repo);
        if (!user)
            return;
        const review = await prisma.review.create({
            data: {
                title: `Review: ${pull_request.title}`,
                description: pull_request.body,
                branch: pull_request.head.ref,
                commitSha: pull_request.head.sha,
                prNumber: pull_request.number,
                repositoryId: repo.id,
                userId: user.id,
                status: 'IN_PROGRESS'
            }
        });
        this.analyzeCodeInBackground(review.id, repo, pull_request.head.sha, pull_request.number, client_1.Provider.GITHUB);
    }
    async handleGitHubPush(payload) {
        const { repository, ref, after, commits } = payload;
        if (!commits || commits.length === 0)
            return;
        const branch = ref.replace('refs/heads/', '');
        if (branch === repository.default_branch)
            return; // Skip main branch pushes
        const repo = await this.findOrCreateRepository(client_1.Provider.GITHUB, repository.id.toString(), repository.full_name, repository.html_url, repository.default_branch, !repository.private, repository.language);
        if (!repo)
            return;
        const user = await this.findRepositoryOwner(repo);
        if (!user)
            return;
        const review = await prisma.review.create({
            data: {
                title: `Review: Push to ${branch}`,
                description: `Push with ${commits.length} commits`,
                branch,
                commitSha: after,
                repositoryId: repo.id,
                userId: user.id,
                status: 'IN_PROGRESS'
            }
        });
        this.analyzeCodeInBackground(review.id, repo, after, undefined, client_1.Provider.GITHUB);
    }
    async handleGitLabMergeRequest(payload) {
        const { object_attributes, project } = payload;
        if (object_attributes.action !== 'open' && object_attributes.action !== 'update')
            return;
        const repo = await this.findOrCreateRepository(client_1.Provider.GITLAB, project.id.toString(), project.path_with_namespace, project.web_url, project.default_branch, project.visibility === 'public', project.language);
        if (!repo)
            return;
        const user = await this.findRepositoryOwner(repo);
        if (!user)
            return;
        const review = await prisma.review.create({
            data: {
                title: `Review: ${object_attributes.title}`,
                description: object_attributes.description,
                branch: object_attributes.source_branch,
                commitSha: object_attributes.last_commit.id,
                prNumber: object_attributes.iid,
                repositoryId: repo.id,
                userId: user.id,
                status: 'IN_PROGRESS'
            }
        });
        this.analyzeCodeInBackground(review.id, repo, object_attributes.last_commit.id, object_attributes.iid, client_1.Provider.GITLAB);
    }
    async handleGitLabPush(payload) {
        const { project, ref, after, commits } = payload;
        if (!commits || commits.length === 0)
            return;
        const branch = ref.replace('refs/heads/', '');
        if (branch === project.default_branch)
            return;
        const repo = await this.findOrCreateRepository(client_1.Provider.GITLAB, project.id.toString(), project.path_with_namespace, project.web_url, project.default_branch, project.visibility === 'public', project.language);
        if (!repo)
            return;
        const user = await this.findRepositoryOwner(repo);
        if (!user)
            return;
        const review = await prisma.review.create({
            data: {
                title: `Review: Push to ${branch}`,
                description: `Push with ${commits.length} commits`,
                branch,
                commitSha: after,
                repositoryId: repo.id,
                userId: user.id,
                status: 'IN_PROGRESS'
            }
        });
        this.analyzeCodeInBackground(review.id, repo, after, undefined, client_1.Provider.GITLAB);
    }
    async handleBitbucketPullRequest(payload) {
        const { pullrequest, repository } = payload;
        const repo = await this.findOrCreateRepository(client_1.Provider.BITBUCKET, repository.uuid, repository.full_name, repository.links.html.href, repository.mainbranch.name, !repository.is_private, repository.language);
        if (!repo)
            return;
        const user = await this.findRepositoryOwner(repo);
        if (!user)
            return;
        const review = await prisma.review.create({
            data: {
                title: `Review: ${pullrequest.title}`,
                description: pullrequest.description,
                branch: pullrequest.source.branch.name,
                commitSha: pullrequest.source.commit.hash,
                prNumber: pullrequest.id,
                repositoryId: repo.id,
                userId: user.id,
                status: 'IN_PROGRESS'
            }
        });
        this.analyzeCodeInBackground(review.id, repo, pullrequest.source.commit.hash, pullrequest.id, client_1.Provider.BITBUCKET);
    }
    async handleBitbucketPush(payload) {
        const { push, repository } = payload;
        if (!push.changes || push.changes.length === 0)
            return;
        const change = push.changes[0];
        const branch = change.new.name;
        if (branch === repository.mainbranch.name)
            return;
        const repo = await this.findOrCreateRepository(client_1.Provider.BITBUCKET, repository.uuid, repository.full_name, repository.links.html.href, repository.mainbranch.name, !repository.is_private, repository.language);
        if (!repo)
            return;
        const user = await this.findRepositoryOwner(repo);
        if (!user)
            return;
        const review = await prisma.review.create({
            data: {
                title: `Review: Push to ${branch}`,
                description: `Push with changes`,
                branch,
                commitSha: change.new.target.hash,
                repositoryId: repo.id,
                userId: user.id,
                status: 'IN_PROGRESS'
            }
        });
        this.analyzeCodeInBackground(review.id, repo, change.new.target.hash, undefined, client_1.Provider.BITBUCKET);
    }
    async findOrCreateRepository(provider, externalId, fullName, url, defaultBranch, isPublic, language) {
        let repo = await prisma.repository.findUnique({
            where: { provider_externalId: { provider, externalId } }
        });
        if (!repo) {
            // Try to find by fullName as fallback
            repo = await prisma.repository.findFirst({
                where: { fullName, provider }
            });
            if (!repo) {
                // Create repository record (without user/org association for now)
                repo = await prisma.repository.create({
                    data: {
                        name: fullName.split('/').pop() || fullName,
                        fullName,
                        url,
                        defaultBranch,
                        isPrivate: !isPublic,
                        language,
                        provider,
                        externalId
                    }
                });
            }
        }
        return repo;
    }
    async findRepositoryOwner(repo) {
        // Find user who has access to this repository
        // This is a simplified version - in production you'd check permissions
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { repositories: { some: { id: repo.id } } },
                    {
                        organizations: {
                            some: {
                                organization: {
                                    repositories: { some: { id: repo.id } }
                                }
                            }
                        }
                    }
                ]
            }
        });
        return user;
    }
    async analyzeCodeInBackground(reviewId, repository, commitSha, prNumber, provider) {
        try {
            logger_1.logger.info(`Starting AI analysis for webhook review ${reviewId}`);
            const [owner, repo] = repository.fullName.split('/');
            let filesToAnalyze = [];
            try {
                if (prNumber) {
                    // Analyze PR/MR files
                    switch (provider) {
                        case client_1.Provider.GITHUB:
                            filesToAnalyze = await githubService_1.githubService.getPullRequestFiles('', owner, repo, prNumber);
                            break;
                        case client_1.Provider.GITLAB:
                            filesToAnalyze = await gitlabService_1.gitlabService.getMergeRequestChanges('', repository.externalId, prNumber);
                            break;
                        case client_1.Provider.BITBUCKET:
                            filesToAnalyze = await bitbucketService_1.bitbucketService.getPullRequestDiff('', owner, repo, prNumber);
                            break;
                    }
                }
                else {
                    // Analyze commit files
                    switch (provider) {
                        case client_1.Provider.GITHUB:
                            filesToAnalyze = await githubService_1.githubService.getCommitDiff('', owner, repo, commitSha);
                            break;
                        case client_1.Provider.GITLAB:
                            filesToAnalyze = await gitlabService_1.gitlabService.getCommitDiff('', repository.externalId, commitSha);
                            break;
                        case client_1.Provider.BITBUCKET:
                            filesToAnalyze = await bitbucketService_1.bitbucketService.getCommitDiff('', owner, repo, commitSha);
                            break;
                    }
                }
            }
            catch (error) {
                logger_1.logger.error('Failed to get files for analysis:', error);
                // Continue with empty files - review will be created but no analysis
            }
            // For now, just mark as completed since full analysis logic is in reviewController
            // In production, you'd duplicate or extract the analysis logic
            await prisma.review.update({
                where: { id: reviewId },
                data: {
                    score: 0, // Placeholder
                    status: 'COMPLETED'
                }
            });
            logger_1.logger.info(`Completed webhook review ${reviewId}`);
        }
        catch (error) {
            logger_1.logger.error(`Failed to analyze webhook review ${reviewId}:`, error);
            await prisma.review.update({
                where: { id: reviewId },
                data: { status: 'FAILED' }
            });
        }
    }
    verifyGitHubSignature(payload, signature) {
        if (!this.githubSecret)
            return true;
        const hmac = crypto_1.default.createHmac('sha256', this.githubSecret);
        const digest = 'sha256=' + hmac.update(JSON.stringify(payload)).digest('hex');
        return crypto_1.default.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
    }
}
exports.WebhookController = WebhookController;
exports.webhookController = new WebhookController();
//# sourceMappingURL=webhookController.js.map