"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bitbucketService = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("../utils/logger");
class BitbucketService {
    constructor() {
        this.baseURL = 'https://api.bitbucket.org/2.0';
    }
    getHeaders(token) {
        return {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        };
    }
    async getUserRepositories(token) {
        try {
            const response = await axios_1.default.get(`${this.baseURL}/repositories`, {
                headers: this.getHeaders(token),
                params: { role: 'member', pagelen: 100 }
            });
            return response.data.values || [];
        }
        catch (error) {
            logger_1.logger.error('Failed to fetch Bitbucket repositories:', error);
            throw new Error('Failed to fetch repositories');
        }
    }
    async getRepository(token, workspace, repo) {
        try {
            const response = await axios_1.default.get(`${this.baseURL}/repositories/${workspace}/${repo}`, {
                headers: this.getHeaders(token)
            });
            return response.data;
        }
        catch (error) {
            logger_1.logger.error('Failed to fetch Bitbucket repository:', error);
            throw new Error('Failed to fetch repository');
        }
    }
    async getPullRequest(token, workspace, repo, prId) {
        try {
            const response = await axios_1.default.get(`${this.baseURL}/repositories/${workspace}/${repo}/pullrequests/${prId}`, {
                headers: this.getHeaders(token)
            });
            return response.data;
        }
        catch (error) {
            logger_1.logger.error('Failed to fetch Bitbucket pull request:', error);
            throw new Error('Failed to fetch pull request');
        }
    }
    async getPullRequestDiff(token, workspace, repo, prId) {
        try {
            const response = await axios_1.default.get(`${this.baseURL}/repositories/${workspace}/${repo}/pullrequests/${prId}/diffstat`, {
                headers: this.getHeaders(token)
            });
            return response.data.values || [];
        }
        catch (error) {
            logger_1.logger.error('Failed to fetch Bitbucket PR diff:', error);
            throw new Error('Failed to fetch PR diff');
        }
    }
    async getFileContent(token, workspace, repo, path, ref) {
        try {
            const url = `${this.baseURL}/repositories/${workspace}/${repo}/src`;
            const params = { format: 'rendered' };
            if (ref)
                params.at = ref;
            const response = await axios_1.default.get(`${url}/${path}`, {
                headers: this.getHeaders(token),
                params
            });
            return response.data;
        }
        catch (error) {
            logger_1.logger.error('Failed to fetch Bitbucket file content:', error);
            throw new Error('Failed to fetch file content');
        }
    }
    async createPullRequestComment(token, workspace, repo, prId, content) {
        try {
            const url = `${this.baseURL}/repositories/${workspace}/${repo}/pullrequests/${prId}/comments`;
            await axios_1.default.post(url, { content: { raw: content } }, {
                headers: this.getHeaders(token)
            });
        }
        catch (error) {
            logger_1.logger.error('Failed to create Bitbucket PR comment:', error);
            throw new Error('Failed to create PR comment');
        }
    }
    async createWebhook(token, workspace, repo, webhookUrl) {
        try {
            const response = await axios_1.default.post(`${this.baseURL}/repositories/${workspace}/${repo}/hooks`, {
                description: 'AI Code Review Webhook',
                url: webhookUrl,
                active: true,
                events: ['pullrequest:created', 'pullrequest:updated', 'repo:push']
            }, {
                headers: this.getHeaders(token)
            });
            return response.data.uuid;
        }
        catch (error) {
            logger_1.logger.error('Failed to create Bitbucket webhook:', error);
            throw new Error('Failed to create webhook');
        }
    }
    async deleteWebhook(token, workspace, repo, webhookId) {
        try {
            await axios_1.default.delete(`${this.baseURL}/repositories/${workspace}/${repo}/hooks/${webhookId}`, {
                headers: this.getHeaders(token)
            });
        }
        catch (error) {
            logger_1.logger.error('Failed to delete Bitbucket webhook:', error);
            throw new Error('Failed to delete webhook');
        }
    }
    async getCommitDiff(token, workspace, repo, commit) {
        try {
            const response = await axios_1.default.get(`${this.baseURL}/repositories/${workspace}/${repo}/diffstat/${commit}`, {
                headers: this.getHeaders(token)
            });
            return response.data.values || [];
        }
        catch (error) {
            logger_1.logger.error('Failed to fetch Bitbucket commit diff:', error);
            throw new Error('Failed to fetch commit diff');
        }
    }
}
exports.bitbucketService = new BitbucketService();
//# sourceMappingURL=bitbucketService.js.map