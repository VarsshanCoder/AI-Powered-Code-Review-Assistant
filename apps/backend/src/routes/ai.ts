import { Router } from "express";
import { body } from "express-validator";
import { reviewController } from "../controllers/reviewController";
export const aiRouter = Router();
aiRouter.post("/review", reviewController.reviewCode);
aiRouter.post("/explain", reviewController.explainCode);
