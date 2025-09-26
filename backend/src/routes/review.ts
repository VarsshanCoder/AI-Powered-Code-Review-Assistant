import { Router } from 'express';
import { reviewController } from '../controllers/reviewController';

const router = Router();

router.post('/', reviewController.createReview.bind(reviewController));
router.get('/', reviewController.getReviews.bind(reviewController));
router.get('/:id', reviewController.getReview.bind(reviewController));
router.post('/:id/comments', reviewController.addComment.bind(reviewController));
router.post('/findings/:findingId/auto-fix', reviewController.applyAutoFix.bind(reviewController));

export default router;