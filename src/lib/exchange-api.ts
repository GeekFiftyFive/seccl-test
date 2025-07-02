import axios, { type AxiosError, type AxiosResponse } from "axios";
import type { ExchangeRateModel } from "./interfaces/model";
import type {
  ExchangeRateResponse,
  ExchangeRateSuccessResponse,
} from "./interfaces/response";
import { exchangeApiSchema } from "../schemas/exchangeApiResponse.schema"; // TODO: Investigate failure to resolve @app/...
import { logger } from "../logger";
import { retry } from "../utils/retry";

export class ExchangeApiClient {
  private readonly baseUrl: string = "https://open.er-api.com/v6/latest/";

  public async getExchangeRate(
    baseCode: string,
    exchangeCode: string
  ): Promise<ExchangeRateModel | null> {
    const url = `${this.baseUrl}${baseCode}`;

    function isRetryable(e: unknown) {
      return (e as AxiosError).response?.status === 429;
    }

    let response: AxiosResponse<ExchangeRateResponse>;
    try {
      response = await retry(() => axios.get(url), 3, 1000, isRetryable);
    } catch (e) {
      response = (e as AxiosError)
        .response as AxiosResponse<ExchangeRateResponse>;
    }

    if (!this.isSuccessResponse(response.data)) {
      throw new Error(response.data["error-type"]);
    }

    const parsedResponse = exchangeApiSchema.safeParse(response.data);
    if (!parsedResponse.success) {
      logger.error({
        message: "Received invalid response from exchange API",
        response,
        parsedResponse,
      });
      throw new Error("Received invalid response from exchange API");
    }

    const rate = parsedResponse.data.rates[exchangeCode];
    if (rate === undefined) {
      logger.warn({
        message: "Exchange rate not found",
        response: response.data,
      });
      return null;
    }

    return {
      baseCode,
      exchangeCode,
      rate,
    };
  }

  private isSuccessResponse(
    response: ExchangeRateResponse
  ): response is ExchangeRateSuccessResponse {
    return response.result === "success";
  }
}
