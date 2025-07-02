import { logger } from "@app/logger";
import type { Request, Response } from "express";

export const exchangeHandler = (_req: Request, res: Response) => {
  logger.info("GET /exchange");

  res.send({
    exchangeRate: { baseCode: "GBP", exchangeCode: "USD", rate: 1.23 },
  });
};
