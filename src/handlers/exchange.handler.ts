import { logger } from "@app/logger";
import { queryParamsSchema } from "@app/schemas/queryParams.schema";
import type { Request, Response } from "express";

export const exchangeHandler = (req: Request, res: Response) => {
  logger.info({ message: "GET /exchange" });
  const parsedQueryParams = queryParamsSchema.safeParse(req.query);

  if (!parsedQueryParams.success) {
    logger.error({
      message: "Invalid query params",
      queryParams: parsedQueryParams,
    });
    res.status(400).send({
      message: "Invalid query params",
      issues: parsedQueryParams.error.issues,
    });
    return;
  }

  res.send({
    exchangeRate: { baseCode: "GBP", exchangeCode: "USD", rate: 1.23 },
  });
};
