"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviewController_1 = require("../controllers/reviewController");
const router = (0, express_1.Router)();
router.post('/', reviewController_1.reviewController.createReview.bind(reviewController_1.reviewController));
router.get('/', reviewController_1.reviewController.getReviews.bind(reviewController_1.reviewController));
router.get('/:id', reviewController_1.reviewController.getReview.bind(reviewController_1.reviewController));
router.post('/:id/comments', reviewController_1.reviewController.addComment.bind(reviewController_1.reviewController));
router.post('/findings/:findingId/auto-fix', reviewController_1.reviewController.applyAutoFix.bind(reviewController_1.reviewController));
exports.default = router;
//# sourceMappingURL=review.js.map