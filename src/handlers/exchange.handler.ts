import { ExchangeApiClient } from "@app/lib/exchange-api";
import { logger } from "@app/logger";
import { queryParamsSchema } from "@app/schemas/queryParams.schema";
import type { Request, Response } from "express";

const exchangeApi = new ExchangeApiClient();

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

  try {
    const exchangeRate = await exchangeApi.getExchangeRate(
      baseCode,
      exchangeCode
    );

    if (exchangeRate === null) {
      res.status(404).send({
        message: "Exchange rate not found",
      });
      return;
    }

    res.send({
      exchangeRate,
    });
  } catch (e) {
    logger.error({
      message: "Failed to get exchange rate",
      error: e,
    });
    res.status(500).send({
      message: "Failed to get exchange rate",
      error: e,
    });
  }
};
