import { Octokit } from '@octokit/rest';
import { logger } from '../config/logger';
import { 
  GitRepository, 
  GitPullRequest, 
  GitCommit,
  RepositoryConnection 
} from '../types';

export class GitHubService {
  private octokit: Octokit;

  constructor(accessToken: string) {
    this.octokit = new Octokit({
      auth: accessToken,
    });
  }

  async getUser() {
    try {
      const { data } = await this.octokit.rest.users.getAuthenticated();
      return {
        id: data.id.toString(),
        username: data.login,
        email: data.email,
        name: data.name,
        avatar: data.avatar_url,
      };
    } catch (error) {
      logger.error('Failed to get GitHub user:', error);
      throw error;
    }
  }

  async getRepositories(): Promise<GitRepository[]> {
    try {
      const { data } = await this.octokit.rest.repos.listForAuthenticatedUser({
        sort: 'updated',
        per_page: 100,
      });

      return data.map(repo => ({
        id: repo.id.toString(),
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        private: repo.private,
        language: repo.language,
        defaultBranch: repo.default_branch,
        cloneUrl: repo.clone_url,
        htmlUrl: repo.html_url,
      }));
    } catch (error) {
      logger.error('Failed to get GitHub repositories:', error);
      throw error;
    }
  }

  async getRepository(owner: string, repo: string): Promise<GitRepository> {
    try {
      const { data } = await this.octokit.rest.repos.get({
        owner,
        repo,
      });

      return {
        id: data.id.toString(),
        name: data.name,
        fullName: data.full_name,
        description: data.description,
        private: data.private,
        language: data.language,
        defaultBranch: data.default_branch,
        cloneUrl: data.clone_url,
        htmlUrl: data.html_url,
      };
    } catch (error) {
      logger.error('Failed to get GitHub repository:', error);
      throw error;
    }
  }

  async getPullRequests(owner: string, repo: string, state: 'open' | 'closed' | 'all' = 'open'): Promise<GitPullRequest[]> {
    try {
      const { data } = await this.octokit.rest.pulls.list({
        owner,
        repo,
        state,
        per_page: 100,
      });

      return data.map(pr => ({
        id: pr.id.toString(),
        number: pr.number,
        title: pr.title,
        description: pr.body,
        state: pr.state as 'open' | 'closed',
        headBranch: pr.head.ref,
        baseBranch: pr.base.ref,
        author: {
          username: pr.user?.login || 'unknown',
          avatar: pr.user?.avatar_url,
        },
        htmlUrl: pr.html_url,
        createdAt: new Date(pr.created_at),
        updatedAt: new Date(pr.updated_at),
      }));
    } catch (error) {
      logger.error('Failed to get GitHub pull requests:', error);
      throw error;
    }
  }

  async getPullRequest(owner: string, repo: string, pullNumber: number): Promise<GitPullRequest> {
    try {
      const { data } = await this.octokit.rest.pulls.get({
        owner,
        repo,
        pull_number: pullNumber,
      });

      return {
        id: data.id.toString(),
        number: data.number,
        title: data.title,
        description: data.body,
        state: data.state as 'open' | 'closed',
        headBranch: data.head.ref,
        baseBranch: data.base.ref,
        author: {
          username: data.user?.login || 'unknown',
          avatar: data.user?.avatar_url,
        },
        htmlUrl: data.html_url,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };
    } catch (error) {
      logger.error('Failed to get GitHub pull request:', error);
      throw error;
    }
  }

  async getPullRequestFiles(owner: string, repo: string, pullNumber: number) {
    try {
      const { data } = await this.octokit.rest.pulls.listFiles({
        owner,
        repo,
        pull_number: pullNumber,
      });

      return data.map(file => ({
        filename: file.filename,
        status: file.status,
        additions: file.additions,
        deletions: file.deletions,
        changes: file.changes,
        patch: file.patch,
        sha: file.sha,
        blobUrl: file.blob_url,
      }));
    } catch (error) {
      logger.error('Failed to get GitHub pull request files:', error);
      throw error;
    }
  }

  async getCommits(owner: string, repo: string, sha?: string): Promise<GitCommit[]> {
    try {
      const { data } = await this.octokit.rest.repos.listCommits({
        owner,
        repo,
        sha,
        per_page: 100,
      });

      return data.map(commit => ({
        sha: commit.sha,
        message: commit.commit.message,
        author: {
          name: commit.commit.author?.name || 'unknown',
          email: commit.commit.author?.email || 'unknown',
          date: new Date(commit.commit.author?.date || Date.now()),
        },
        htmlUrl: commit.html_url,
      }));
    } catch (error) {
      logger.error('Failed to get GitHub commits:', error);
      throw error;
    }
  }

  async getFileContent(owner: string, repo: string, path: string, ref?: string): Promise<string> {
    try {
      const { data } = await this.octokit.rest.repos.getContent({
        owner,
        repo,
        path,
        ref,
      });

      if (Array.isArray(data) || data.type !== 'file') {
        throw new Error('Path is not a file');
      }

      if (!data.content) {
        throw new Error('File content not available');
      }

      return Buffer.from(data.content, 'base64').toString('utf-8');
    } catch (error) {
      logger.error('Failed to get GitHub file content:', error);
      throw error;
    }
  }

  async createPullRequestReview(
    owner: string,
    repo: string,
    pullNumber: number,
    body: string,
    event: 'APPROVE' | 'REQUEST_CHANGES' | 'COMMENT' = 'COMMENT',
    comments?: Array<{
      path: string;
      line: number;
      body: string;
    }>
  ) {
    try {
      const reviewData: any = {
        owner,
        repo,
        pull_number: pullNumber,
        body,
        event,
      };

      if (comments && comments.length > 0) {
        reviewData.comments = comments;
      }

      const { data } = await this.octokit.rest.pulls.createReview(reviewData);
      return data;
    } catch (error) {
      logger.error('Failed to create GitHub pull request review:', error);
      throw error;
    }
  }

  async createIssueComment(owner: string, repo: string, issueNumber: number, body: string) {
    try {
      const { data } = await this.octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: issueNumber,
        body,
      });
      return data;
    } catch (error) {
      logger.error('Failed to create GitHub issue comment:', error);
      throw error;
    }
  }

  async createWebhook(owner: string, repo: string, webhookUrl: string, secret: string) {
    try {
      const { data } = await this.octokit.rest.repos.createWebhook({
        owner,
        repo,
        config: {
          url: webhookUrl,
          content_type: 'json',
          secret,
        },
        events: ['push', 'pull_request', 'pull_request_review'],
        active: true,
      });
      return data;
    } catch (error) {
      logger.error('Failed to create GitHub webhook:', error);
      throw error;
    }
  }

  async deleteWebhook(owner: string, repo: string, hookId: number) {
    try {
      await this.octokit.rest.repos.deleteWebhook({
        owner,
        repo,
        hook_id: hookId,
      });
    } catch (error) {
      logger.error('Failed to delete GitHub webhook:', error);
      throw error;
    }
  }

  async getRepoTree(owner: string, repo: string, sha?: string) {
    try {
      const { data } = await this.octokit.rest.git.getTree({
        owner,
        repo,
        tree_sha: sha || 'HEAD',
        recursive: '1',
      });

      return data.tree.map(item => ({
        path: item.path,
        mode: item.mode,
        type: item.type,
        sha: item.sha,
        size: item.size,
        url: item.url,
      }));
    } catch (error) {
      logger.error('Failed to get GitHub repository tree:', error);
      throw error;
    }
  }

  static async validateConnection(connection: RepositoryConnection): Promise<boolean> {
    try {
      const service = new GitHubService(connection.accessToken);
      await service.getUser();
      return true;
    } catch (error) {
      logger.error('GitHub connection validation failed:', error);
      return false;
    }
  }
}

export { GitHubService as GitService };