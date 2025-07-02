import { logger } from "@app/logger";
import type { Request, Response } from "express";

export const rootHandler = (_req: Request, res: Response) => {
  logger.info({ message: "GET /" });

  res.send({ healthy: true });
};
