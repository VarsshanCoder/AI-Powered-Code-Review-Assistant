import axios from 'axios';
import { logger } from '../utils/logger';

interface GitLabRepository {
  id: number;
  name: string;
  path_with_namespace: string;
  description: string;
  web_url: string;
  default_branch: string;
  visibility: string;
  language: string;
}

interface GitLabMergeRequest {
  id: number;
  iid: number;
  title: string;
  description: string;
  source_branch: string;
  target_branch: string;
  sha: string;
  target_branch_sha: string;
}

interface GitLabFile {
  new_path: string;
  old_path: string;
  new_file: boolean;
  renamed_file: boolean;
  deleted_file: boolean;
  diff: string;
}

class GitLabService {
  private baseURL = 'https://gitlab.com/api/v4';

  private getHeaders(token: string) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async getUserProjects(token: string): Promise<GitLabRepository[]> {
    try {
      const response = await axios.get(`${this.baseURL}/projects`, {
        headers: this.getHeaders(token),
        params: { owned: true, per_page: 100, order_by: 'updated_at' }
      });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch GitLab projects:', error);
      throw new Error('Failed to fetch projects');
    }
  }

  async getProject(token: string, projectId: string): Promise<GitLabRepository> {
    try {
      const response = await axios.get(`${this.baseURL}/projects/${encodeURIComponent(projectId)}`, {
        headers: this.getHeaders(token)
      });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch GitLab project:', error);
      throw new Error('Failed to fetch project');
    }
  }

  async getMergeRequest(token: string, projectId: string, mrNumber: number): Promise<GitLabMergeRequest> {
    try {
      const response = await axios.get(`${this.baseURL}/projects/${encodeURIComponent(projectId)}/merge_requests/${mrNumber}`, {
        headers: this.getHeaders(token)
      });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch GitLab merge request:', error);
      throw new Error('Failed to fetch merge request');
    }
  }

  async getMergeRequestChanges(token: string, projectId: string, mrNumber: number): Promise<GitLabFile[]> {
    try {
      const response = await axios.get(`${this.baseURL}/projects/${encodeURIComponent(projectId)}/merge_requests/${mrNumber}/changes`, {
        headers: this.getHeaders(token)
      });
      return response.data.changes || [];
    } catch (error) {
      logger.error('Failed to fetch GitLab MR changes:', error);
      throw new Error('Failed to fetch MR changes');
    }
  }

  async getFileContent(token: string, projectId: string, filePath: string, ref?: string): Promise<string> {
    try {
      const url = `${this.baseURL}/projects/${encodeURIComponent(projectId)}/repository/files/${encodeURIComponent(filePath)}`;
      const params = ref ? { ref } : {};

      const response = await axios.get(url, {
        headers: this.getHeaders(token),
        params
      });

      if (response.data.encoding === 'base64') {
        return Buffer.from(response.data.content, 'base64').toString('utf-8');
      }
      return response.data.content;
    } catch (error) {
      logger.error('Failed to fetch GitLab file content:', error);
      throw new Error('Failed to fetch file content');
    }
  }

  async createMergeRequestComment(
    token: string,
    projectId: string,
    mrNumber: number,
    body: string
  ): Promise<void> {
    try {
      const url = `${this.baseURL}/projects/${encodeURIComponent(projectId)}/merge_requests/${mrNumber}/notes`;
      await axios.post(url, { body }, {
        headers: this.getHeaders(token)
      });
    } catch (error) {
      logger.error('Failed to create GitLab MR comment:', error);
      throw new Error('Failed to create MR comment');
    }
  }

  async createWebhook(token: string, projectId: string, webhookUrl: string): Promise<string> {
    try {
      const response = await axios.post(`${this.baseURL}/projects/${encodeURIComponent(projectId)}/hooks`, {
        url: webhookUrl,
        merge_requests_events: true,
        push_events: true,
        enable_ssl_verification: true
      }, {
        headers: this.getHeaders(token)
      });

      return response.data.id.toString();
    } catch (error) {
      logger.error('Failed to create GitLab webhook:', error);
      throw new Error('Failed to create webhook');
    }
  }

  async deleteWebhook(token: string, projectId: string, webhookId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseURL}/projects/${encodeURIComponent(projectId)}/hooks/${webhookId}`, {
        headers: this.getHeaders(token)
      });
    } catch (error) {
      logger.error('Failed to delete GitLab webhook:', error);
      throw new Error('Failed to delete webhook');
    }
  }

  async getCommitDiff(token: string, projectId: string, sha: string): Promise<GitLabFile[]> {
    try {
      const response = await axios.get(`${this.baseURL}/projects/${encodeURIComponent(projectId)}/repository/commits/${sha}/diff`, {
        headers: this.getHeaders(token)
      });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch GitLab commit diff:', error);
      throw new Error('Failed to fetch commit diff');
    }
  }
}

export const gitlabService = new GitLabService();
