import axios from 'axios';
import { logger } from '../utils/logger';

interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  default_branch: string;
  private: boolean;
  language: string;
}

interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  body: string;
  head: { sha: string; ref: string };
  base: { sha: string; ref: string };
}

interface GitHubFile {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  changes: number;
  patch?: string;
}

class GitHubService {
  private baseURL = 'https://api.github.com';

  private getHeaders(token: string) {
    return {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'AI-Code-Review-Assistant'
    };
  }

  async getUserRepositories(token: string): Promise<GitHubRepository[]> {
    try {
      const response = await axios.get(`${this.baseURL}/user/repos`, {
        headers: this.getHeaders(token),
        params: { per_page: 100, sort: 'updated' }
      });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch GitHub repositories:', error);
      throw new Error('Failed to fetch repositories');
    }
  }

  async getRepository(token: string, owner: string, repo: string): Promise<GitHubRepository> {
    try {
      const response = await axios.get(`${this.baseURL}/repos/${owner}/${repo}`, {
        headers: this.getHeaders(token)
      });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch GitHub repository:', error);
      throw new Error('Failed to fetch repository');
    }
  }

  async getPullRequest(token: string, owner: string, repo: string, prNumber: number): Promise<GitHubPullRequest> {
    try {
      const response = await axios.get(`${this.baseURL}/repos/${owner}/${repo}/pulls/${prNumber}`, {
        headers: this.getHeaders(token)
      });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch GitHub pull request:', error);
      throw new Error('Failed to fetch pull request');
    }
  }

  async getPullRequestFiles(token: string, owner: string, repo: string, prNumber: number): Promise<GitHubFile[]> {
    try {
      const response = await axios.get(`${this.baseURL}/repos/${owner}/${repo}/pulls/${prNumber}/files`, {
        headers: this.getHeaders(token)
      });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch GitHub PR files:', error);
      throw new Error('Failed to fetch PR files');
    }
  }

  async getFileContent(token: string, owner: string, repo: string, path: string, ref?: string): Promise<string> {
    try {
      const url = `${this.baseURL}/repos/${owner}/${repo}/contents/${path}`;
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
      logger.error('Failed to fetch GitHub file content:', error);
      throw new Error('Failed to fetch file content');
    }
  }

  async createPullRequestComment(
    token: string,
    owner: string,
    repo: string,
    prNumber: number,
    body: string,
    commitSha?: string,
    path?: string,
    line?: number
  ): Promise<void> {
    try {
      const url = `${this.baseURL}/repos/${owner}/${repo}/pulls/${prNumber}/comments`;
      const data: any = { body };
      
      if (commitSha && path && line) {
        data.commit_id = commitSha;
        data.path = path;
        data.line = line;
      }

      await axios.post(url, data, {
        headers: this.getHeaders(token)
      });
    } catch (error) {
      logger.error('Failed to create GitHub PR comment:', error);
      throw new Error('Failed to create PR comment');
    }
  }

  async createWebhook(token: string, owner: string, repo: string, webhookUrl: string): Promise<string> {
    try {
      const response = await axios.post(`${this.baseURL}/repos/${owner}/${repo}/hooks`, {
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
    } catch (error) {
      logger.error('Failed to create GitHub webhook:', error);
      throw new Error('Failed to create webhook');
    }
  }

  async deleteWebhook(token: string, owner: string, repo: string, webhookId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseURL}/repos/${owner}/${repo}/hooks/${webhookId}`, {
        headers: this.getHeaders(token)
      });
    } catch (error) {
      logger.error('Failed to delete GitHub webhook:', error);
      throw new Error('Failed to delete webhook');
    }
  }

  async getCommitDiff(token: string, owner: string, repo: string, sha: string): Promise<GitHubFile[]> {
    try {
      const response = await axios.get(`${this.baseURL}/repos/${owner}/${repo}/commits/${sha}`, {
        headers: this.getHeaders(token)
      });
      return response.data.files || [];
    } catch (error) {
      logger.error('Failed to fetch GitHub commit diff:', error);
      throw new Error('Failed to fetch commit diff');
    }
  }
}

export const githubService = new GitHubService();