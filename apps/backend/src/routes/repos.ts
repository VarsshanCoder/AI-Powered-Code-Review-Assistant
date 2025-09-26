import { Router } from "express";
export const reposRouter = Router();
reposRouter.get("/list", async (_req, res) => {
  res.json({ providers: ["github", "gitlab", "bitbucket"], repos: [] });
});
