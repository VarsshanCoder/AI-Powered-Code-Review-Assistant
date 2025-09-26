"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.githubService = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("../utils/logger");
class GitHubService {
    constructor() {
        this.baseURL = 'https://api.github.com';
    }
    getHeaders(token) {
        return {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'AI-Code-Review-Assistant'
        };
    }
    async getUserRepositories(token) {
        try {
            const response = await axios_1.default.get(`${this.baseURL}/user/repos`, {
                headers: this.getHeaders(token),
                params: { per_page: 100, sort: 'updated' }
            });
            return response.data;
        }
        catch (error) {
            logger_1.logger.error('Failed to fetch GitHub repositories:', error);
            throw new Error('Failed to fetch repositories');
        }
    }
    async getRepository(token, owner, repo) {
        try {
            const response = await axios_1.default.get(`${this.baseURL}/repos/${owner}/${repo}`, {
                headers: this.getHeaders(token)
            });
            return response.data;
        }
        catch (error) {
            logger_1.logger.error('Failed to fetch GitHub repository:', error);
            throw new Error('Failed to fetch repository');
        }
    }
    async getPullRequest(token, owner, repo, prNumber) {
        try {
            const response = await axios_1.default.get(`${this.baseURL}/repos/${owner}/${repo}/pulls/${prNumber}`, {
                headers: this.getHeaders(token)
            });
            return response.data;
        }
        catch (error) {
            logger_1.logger.error('Failed to fetch GitHub pull request:', error);
            throw new Error('Failed to fetch pull request');
        }
    }
    async getPullRequestFiles(token, owner, repo, prNumber) {
        try {
            const response = await axios_1.default.get(`${this.baseURL}/repos/${owner}/${repo}/pulls/${prNumber}/files`, {
                headers: this.getHeaders(token)
            });
            return response.data;
        }
        catch (error) {
            logger_1.logger.error('Failed to fetch GitHub PR files:', error);
            throw new Error('Failed to fetch PR files');
        }
    }
    async getFileContent(token, owner, repo, path, ref) {
        try {
            const url = `${this.baseURL}/repos/${owner}/${repo}/contents/${path}`;
            const params = ref ? { ref } : {};
            const response = await axios_1.default.get(url, {
                headers: this.getHeaders(token),
                params
            });
            if (response.data.encoding === 'base64') {
                return Buffer.from(response.data.content, 'base64').toString('utf-8');
            }
            return response.data.content;
        }
        catch (error) {
            logger_1.logger.error('Failed to fetch GitHub file content:', error);
            throw new Error('Failed to fetch file content');
        }
    }
    async createPullRequestComment(token, owner, repo, prNumber, body, commitSha, path, line) {
        try {
            const url = `${this.baseURL}/repos/${owner}/${repo}/pulls/${prNumber}/comments`;
            const data = { body };
            if (commitSha && path && line) {
                data.commit_id = commitSha;
                data.path = path;
                data.line = line;
            }
            await axios_1.default.post(url, data, {
                headers: this.getHeaders(token)
            });
        }
        catch (error) {
            logger_1.logger.error('Failed to create GitHub PR comment:', error);
            throw new Error('Failed to create PR comment');
        }
    }
    async createWebhook(token, owner, repo, webhookUrl) {
        try {
            const response = await axios_1.default.post(`${this.baseURL}/repos/${owner}/${repo}/hooks`, {
                name: 'web',
                active: true,
                events: ['pull_request', 'push'],
                config: {
                    url: webhookUrl,
                    content_type: 'json'
                }
            }, {
                headers: this.getHeaders(token)
            });
            return response.data.id.toString();
        }
        catch (error) {
            logger_1.logger.error('Failed to create GitHub webhook:', error);
            throw new Error('Failed to create webhook');
        }
    }
    async deleteWebhook(token, owner, repo, webhookId) {
        try {
            await axios_1.default.delete(`${this.baseURL}/repos/${owner}/${repo}/hooks/${webhookId}`, {
                headers: this.getHeaders(token)
            });
        }
        catch (error) {
            logger_1.logger.error('Failed to delete GitHub webhook:', error);
            throw new Error('Failed to delete webhook');
        }
    }
    async getCommitDiff(token, owner, repo, sha) {
        try {
            const response = await axios_1.default.get(`${this.baseURL}/repos/${owner}/${repo}/commits/${sha}`, {
                headers: this.getHeaders(token)
            });
            return response.data.files || [];
        }
        catch (error) {
            logger_1.logger.error('Failed to fetch GitHub commit diff:', error);
            throw new Error('Failed to fetch commit diff');
        }
    }
}
exports.githubService = new GitHubService();
//# sourceMappingURL=githubService.js.map