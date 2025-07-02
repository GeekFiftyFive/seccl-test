import { ExchangeApi } from "@app/lib/exchange-api";
import { logger } from "@app/logger";
import { queryParamsSchema } from "@app/schemas/queryParams.schema";
import type { Request, Response } from "express";

const exchangeApi = new ExchangeApi();

export const exchangeHandler = async (req: Request, res: Response) => {
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

  const { baseCode, exchangeCode } = parsedQueryParams.data;

  const exchangeRate = await exchangeApi.getExchangeRate(
    baseCode,
    exchangeCode
  );

  res.send({
    exchangeRate,
  });
};
