import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import express from "express";
import pino from "pino";
import pinoHttp from "pino-http";
import { apiRouter } from "./routes/api";

dotenv.config();

const logger = pino({ transport: { target: "pino-pretty" } });
const app = express();

app.use(helmet());
app.use(express.json({ limit: "2mb" }));
app.use(cors({ origin: (process.env.ALLOWED_ORIGINS || "").split(",").filter(Boolean) }));
app.use(pinoHttp({ logger }));

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api", apiRouter);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  logger.info({ port }, "Backend listening");
});
