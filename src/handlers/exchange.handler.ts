import { ExchangeApiClient } from "@app/lib/exchange-api";
import { logger } from "@app/logger";
import { queryParamsSchema } from "@app/schemas/queryParams.schema";
import type { Request, Response } from "express";

const exchangeApi = new ExchangeApiClient();

enum ErrorMessage {
  EXCHANGE_RATE_NOT_FOUND = "Exchange rate not found",
  FAILED_TO_GET_EXCHANGE_RATE = "Failed to get exchange rate",
  INVALID_QUERY_PARAMS = "Invalid query params",
}

export const exchangeHandler = async (req: Request, res: Response) => {
  logger.info({ message: "GET /exchange" });
  const parsedQueryParams = queryParamsSchema.safeParse(req.query);

  if (!parsedQueryParams.success) {
    logger.error({
      message: ErrorMessage.INVALID_QUERY_PARAMS,
      queryParams: parsedQueryParams,
    });
    res.status(400).send({
      message: ErrorMessage.INVALID_QUERY_PARAMS,
      issues: parsedQueryParams.error.issues,
    });
    return;
  }

  const { baseCode, exchangeCode } = parsedQueryParams.data;

  try {
    const exchangeRate = await exchangeApi.getExchangeRate(
      baseCode,
      exchangeCode
    );

    if (exchangeRate === null) {
      res.status(404).send({
        message: ErrorMessage.EXCHANGE_RATE_NOT_FOUND,
      });
      return;
    }

    res.send({
      exchangeRate,
    });
  } catch (e) {
    if ((e as Error).message === "unsupported-code") {
      res.status(404).send({
        message: ErrorMessage.EXCHANGE_RATE_NOT_FOUND,
      });
      return;
    }
    logger.error({
      message: ErrorMessage.FAILED_TO_GET_EXCHANGE_RATE,
      error: e,
    });
    res.status(500).send({
      message: ErrorMessage.FAILED_TO_GET_EXCHANGE_RATE,
      error: e,
    });
  }
};
