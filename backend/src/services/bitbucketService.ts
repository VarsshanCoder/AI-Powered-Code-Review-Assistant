import axios from 'axios';
import { logger } from '../utils/logger';

interface BitbucketRepository {
  uuid: string;
  full_name: string;
  name: string;
  description: string;
  links: {
    html: { href: string };
  };
  mainbranch: {
    name: string;
  };
  is_private: boolean;
  language: string;
}

interface BitbucketPullRequest {
  id: number;
  title: string;
  description: string;
  source: {
    branch: { name: string };
    commit: { hash: string };
  };
  destination: {
    branch: { name: string };
    commit: { hash: string };
  };
}

interface BitbucketFile {
  type: string;
  file: string;
  status: string;
  lines_added?: number;
  lines_removed?: number;
}

class BitbucketService {
  private baseURL = 'https://api.bitbucket.org/2.0';

  private getHeaders(token: string) {
    return {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    };
  }

  async getUserRepositories(token: string): Promise<BitbucketRepository[]> {
    try {
      const response = await axios.get(`${this.baseURL}/repositories`, {
        headers: this.getHeaders(token),
        params: { role: 'member', pagelen: 100 }
      });
      return response.data.values || [];
    } catch (error) {
      logger.error('Failed to fetch Bitbucket repositories:', error);
      throw new Error('Failed to fetch repositories');
    }
  }

  async getRepository(token: string, workspace: string, repo: string): Promise<BitbucketRepository> {
    try {
      const response = await axios.get(`${this.baseURL}/repositories/${workspace}/${repo}`, {
        headers: this.getHeaders(token)
      });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch Bitbucket repository:', error);
      throw new Error('Failed to fetch repository');
    }
  }

  async getPullRequest(token: string, workspace: string, repo: string, prId: number): Promise<BitbucketPullRequest> {
    try {
      const response = await axios.get(`${this.baseURL}/repositories/${workspace}/${repo}/pullrequests/${prId}`, {
        headers: this.getHeaders(token)
      });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch Bitbucket pull request:', error);
      throw new Error('Failed to fetch pull request');
    }
  }

  async getPullRequestDiff(token: string, workspace: string, repo: string, prId: number): Promise<BitbucketFile[]> {
    try {
      const response = await axios.get(`${this.baseURL}/repositories/${workspace}/${repo}/pullrequests/${prId}/diffstat`, {
        headers: this.getHeaders(token)
      });
      return response.data.values || [];
    } catch (error) {
      logger.error('Failed to fetch Bitbucket PR diff:', error);
      throw new Error('Failed to fetch PR diff');
    }
  }

  async getFileContent(token: string, workspace: string, repo: string, path: string, ref?: string): Promise<string> {
    try {
      const url = `${this.baseURL}/repositories/${workspace}/${repo}/src`;
      const params: any = { format: 'rendered' };
      if (ref) params.at = ref;

      const response = await axios.get(`${url}/${path}`, {
        headers: this.getHeaders(token),
        params
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to fetch Bitbucket file content:', error);
      throw new Error('Failed to fetch file content');
    }
  }

  async createPullRequestComment(
    token: string,
    workspace: string,
    repo: string,
    prId: number,
    content: string
  ): Promise<void> {
    try {
      const url = `${this.baseURL}/repositories/${workspace}/${repo}/pullrequests/${prId}/comments`;
      await axios.post(url, { content: { raw: content } }, {
        headers: this.getHeaders(token)
      });
    } catch (error) {
      logger.error('Failed to create Bitbucket PR comment:', error);
      throw new Error('Failed to create PR comment');
    }
  }

  async createWebhook(token: string, workspace: string, repo: string, webhookUrl: string): Promise<string> {
    try {
      const response = await axios.post(`${this.baseURL}/repositories/${workspace}/${repo}/hooks`, {
        description: 'AI Code Review Webhook',
        url: webhookUrl,
        active: true,
        events: ['pullrequest:created', 'pullrequest:updated', 'repo:push']
      }, {
        headers: this.getHeaders(token)
      });

      return response.data.uuid;
    } catch (error) {
      logger.error('Failed to create Bitbucket webhook:', error);
      throw new Error('Failed to create webhook');
    }
  }

  async deleteWebhook(token: string, workspace: string, repo: string, webhookId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseURL}/repositories/${workspace}/${repo}/hooks/${webhookId}`, {
        headers: this.getHeaders(token)
      });
    } catch (error) {
      logger.error('Failed to delete Bitbucket webhook:', error);
      throw new Error('Failed to delete webhook');
    }
  }

  async getCommitDiff(token: string, workspace: string, repo: string, commit: string): Promise<BitbucketFile[]> {
    try {
      const response = await axios.get(`${this.baseURL}/repositories/${workspace}/${repo}/diffstat/${commit}`, {
        headers: this.getHeaders(token)
      });
      return response.data.values || [];
    } catch (error) {
      logger.error('Failed to fetch Bitbucket commit diff:', error);
      throw new Error('Failed to fetch commit diff');
    }
  }
}

export const bitbucketService = new BitbucketService();
