interface BitbucketRepository {
    uuid: string;
    full_name: string;
    name: string;
    description: string;
    links: {
        html: {
            href: string;
        };
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
        branch: {
            name: string;
        };
        commit: {
            hash: string;
        };
    };
    destination: {
        branch: {
            name: string;
        };
        commit: {
            hash: string;
        };
    };
}
interface BitbucketFile {
    type: string;
    file: string;
    status: string;
    lines_added?: number;
    lines_removed?: number;
}
declare class BitbucketService {
    private baseURL;
    private getHeaders;
    getUserRepositories(token: string): Promise<BitbucketRepository[]>;
    getRepository(token: string, workspace: string, repo: string): Promise<BitbucketRepository>;
    getPullRequest(token: string, workspace: string, repo: string, prId: number): Promise<BitbucketPullRequest>;
    getPullRequestDiff(token: string, workspace: string, repo: string, prId: number): Promise<BitbucketFile[]>;
    getFileContent(token: string, workspace: string, repo: string, path: string, ref?: string): Promise<string>;
    createPullRequestComment(token: string, workspace: string, repo: string, prId: number, content: string): Promise<void>;
    createWebhook(token: string, workspace: string, repo: string, webhookUrl: string): Promise<string>;
    deleteWebhook(token: string, workspace: string, repo: string, webhookId: string): Promise<void>;
    getCommitDiff(token: string, workspace: string, repo: string, commit: string): Promise<BitbucketFile[]>;
}
export declare const bitbucketService: BitbucketService;
export {};
//# sourceMappingURL=bitbucketService.d.ts.map