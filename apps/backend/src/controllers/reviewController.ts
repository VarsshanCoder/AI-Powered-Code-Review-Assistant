import type { Request, Response } from "express";
import { z } from "zod";
import { aiService } from "../services/aiService";

const ReviewSchema = z.object({
  language: z.string(),
  code: z.string().min(1),
  context: z.record(z.any()).optional(),
});

async function reviewCode(req: Request, res: Response) {
  const parse = ReviewSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const result = await aiService.reviewCode(parse.data);
  res.json(result);
}

async function explainCode(req: Request, res: Response) {
  const parse = ReviewSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const result = await aiService.explainCode(parse.data);
  res.json(result);
}

export const reviewController = { reviewCode, explainCode };
