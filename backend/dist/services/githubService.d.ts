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
    head: {
        sha: string;
        ref: string;
    };
    base: {
        sha: string;
        ref: string;
    };
}
interface GitHubFile {
    filename: string;
    status: string;
    additions: number;
    deletions: number;
    changes: number;
    patch?: string;
}
declare class GitHubService {
    private baseURL;
    private getHeaders;
    getUserRepositories(token: string): Promise<GitHubRepository[]>;
    getRepository(token: string, owner: string, repo: string): Promise<GitHubRepository>;
    getPullRequest(token: string, owner: string, repo: string, prNumber: number): Promise<GitHubPullRequest>;
    getPullRequestFiles(token: string, owner: string, repo: string, prNumber: number): Promise<GitHubFile[]>;
    getFileContent(token: string, owner: string, repo: string, path: string, ref?: string): Promise<string>;
    createPullRequestComment(token: string, owner: string, repo: string, prNumber: number, body: string, commitSha?: string, path?: string, line?: number): Promise<void>;
    createWebhook(token: string, owner: string, repo: string, webhookUrl: string): Promise<string>;
    deleteWebhook(token: string, owner: string, repo: string, webhookId: string): Promise<void>;
    getCommitDiff(token: string, owner: string, repo: string, sha: string): Promise<GitHubFile[]>;
}
export declare const githubService: GitHubService;
export {};
//# sourceMappingURL=githubService.d.ts.map