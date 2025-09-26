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
declare class GitLabService {
    private baseURL;
    private getHeaders;
    getUserProjects(token: string): Promise<GitLabRepository[]>;
    getProject(token: string, projectId: string): Promise<GitLabRepository>;
    getMergeRequest(token: string, projectId: string, mrNumber: number): Promise<GitLabMergeRequest>;
    getMergeRequestChanges(token: string, projectId: string, mrNumber: number): Promise<GitLabFile[]>;
    getFileContent(token: string, projectId: string, filePath: string, ref?: string): Promise<string>;
    createMergeRequestComment(token: string, projectId: string, mrNumber: number, body: string): Promise<void>;
    createWebhook(token: string, projectId: string, webhookUrl: string): Promise<string>;
    deleteWebhook(token: string, projectId: string, webhookId: string): Promise<void>;
    getCommitDiff(token: string, projectId: string, sha: string): Promise<GitLabFile[]>;
}
export declare const gitlabService: GitLabService;
export {};
//# sourceMappingURL=gitlabService.d.ts.map