import { Router } from "express";
import { aiRouter } from "./ai";
import { reposRouter } from "./repos";
export const apiRouter = Router();
apiRouter.use("/ai", aiRouter);
apiRouter.use("/repos", reposRouter);
