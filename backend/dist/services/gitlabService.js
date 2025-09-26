"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitlabService = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("../utils/logger");
class GitLabService {
    constructor() {
        this.baseURL = 'https://gitlab.com/api/v4';
    }
    getHeaders(token) {
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }
    async getUserProjects(token) {
        try {
            const response = await axios_1.default.get(`${this.baseURL}/projects`, {
                headers: this.getHeaders(token),
                params: { owned: true, per_page: 100, order_by: 'updated_at' }
            });
            return response.data;
        }
        catch (error) {
            logger_1.logger.error('Failed to fetch GitLab projects:', error);
            throw new Error('Failed to fetch projects');
        }
    }
    async getProject(token, projectId) {
        try {
            const response = await axios_1.default.get(`${this.baseURL}/projects/${encodeURIComponent(projectId)}`, {
                headers: this.getHeaders(token)
            });
            return response.data;
        }
        catch (error) {
            logger_1.logger.error('Failed to fetch GitLab project:', error);
            throw new Error('Failed to fetch project');
        }
    }
    async getMergeRequest(token, projectId, mrNumber) {
        try {
            const response = await axios_1.default.get(`${this.baseURL}/projects/${encodeURIComponent(projectId)}/merge_requests/${mrNumber}`, {
                headers: this.getHeaders(token)
            });
            return response.data;
        }
        catch (error) {
            logger_1.logger.error('Failed to fetch GitLab merge request:', error);
            throw new Error('Failed to fetch merge request');
        }
    }
    async getMergeRequestChanges(token, projectId, mrNumber) {
        try {
            const response = await axios_1.default.get(`${this.baseURL}/projects/${encodeURIComponent(projectId)}/merge_requests/${mrNumber}/changes`, {
                headers: this.getHeaders(token)
            });
            return response.data.changes || [];
        }
        catch (error) {
            logger_1.logger.error('Failed to fetch GitLab MR changes:', error);
            throw new Error('Failed to fetch MR changes');
        }
    }
    async getFileContent(token, projectId, filePath, ref) {
        try {
            const url = `${this.baseURL}/projects/${encodeURIComponent(projectId)}/repository/files/${encodeURIComponent(filePath)}`;
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
            logger_1.logger.error('Failed to fetch GitLab file content:', error);
            throw new Error('Failed to fetch file content');
        }
    }
    async createMergeRequestComment(token, projectId, mrNumber, body) {
        try {
            const url = `${this.baseURL}/projects/${encodeURIComponent(projectId)}/merge_requests/${mrNumber}/notes`;
            await axios_1.default.post(url, { body }, {
                headers: this.getHeaders(token)
            });
        }
        catch (error) {
            logger_1.logger.error('Failed to create GitLab MR comment:', error);
            throw new Error('Failed to create MR comment');
        }
    }
    async createWebhook(token, projectId, webhookUrl) {
        try {
            const response = await axios_1.default.post(`${this.baseURL}/projects/${encodeURIComponent(projectId)}/hooks`, {
                url: webhookUrl,
                merge_requests_events: true,
                push_events: true,
                enable_ssl_verification: true
            }, {
                headers: this.getHeaders(token)
            });
            return response.data.id.toString();
        }
        catch (error) {
            logger_1.logger.error('Failed to create GitLab webhook:', error);
            throw new Error('Failed to create webhook');
        }
    }
    async deleteWebhook(token, projectId, webhookId) {
        try {
            await axios_1.default.delete(`${this.baseURL}/projects/${encodeURIComponent(projectId)}/hooks/${webhookId}`, {
                headers: this.getHeaders(token)
            });
        }
        catch (error) {
            logger_1.logger.error('Failed to delete GitLab webhook:', error);
            throw new Error('Failed to delete webhook');
        }
    }
    async getCommitDiff(token, projectId, sha) {
        try {
            const response = await axios_1.default.get(`${this.baseURL}/projects/${encodeURIComponent(projectId)}/repository/commits/${sha}/diff`, {
                headers: this.getHeaders(token)
            });
            return response.data;
        }
        catch (error) {
            logger_1.logger.error('Failed to fetch GitLab commit diff:', error);
            throw new Error('Failed to fetch commit diff');
        }
    }
}
exports.gitlabService = new GitLabService();
//# sourceMappingURL=gitlabService.js.map