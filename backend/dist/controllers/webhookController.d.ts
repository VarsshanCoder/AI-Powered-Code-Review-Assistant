import { Request, Response } from 'express';
export declare class WebhookController {
    private githubSecret;
    private gitlabSecret;
    private bitbucketSecret;
    handleGitHubWebhook(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    handleGitLabWebhook(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    handleBitbucketWebhook(req: Request, res: Response): Promise<void>;
    private handleGitHubPullRequest;
    private handleGitHubPush;
    private handleGitLabMergeRequest;
    private handleGitLabPush;
    private handleBitbucketPullRequest;
    private handleBitbucketPush;
    private findOrCreateRepository;
    private findRepositoryOwner;
    private analyzeCodeInBackground;
    private verifyGitHubSignature;
}
export declare const webhookController: WebhookController;
//# sourceMappingURL=webhookController.d.ts.map