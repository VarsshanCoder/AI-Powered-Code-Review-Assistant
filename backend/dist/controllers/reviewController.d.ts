import { Request, Response } from 'express';
export declare class ReviewController {
    createReview(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getReview(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getReviews(req: Request, res: Response): Promise<void>;
    addComment(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    applyAutoFix(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    private analyzeCodeInBackground;
    private detectLanguage;
}
export declare const reviewController: ReviewController;
//# sourceMappingURL=reviewController.d.ts.map