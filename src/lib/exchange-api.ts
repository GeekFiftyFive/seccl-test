import axios from "axios";
import type { ExchangeRateModel } from "./interfaces/model";
import type {
  ExchangeRateResponse,
  ExchangeRateSuccessResponse,
} from "./interfaces/response";
import { exchangeApiSchema } from "../schemas/exchangeApiResponse.schema"; // TODO: Investigate failure to resolve @app/...
import { logger } from "../logger";

export class ExchangeApi {
  private readonly baseUrl: string = "https://open.er-api.com/v6/latest/";

  public async getExchangeRate(
    baseCode: string,
    exchangeCode: string
  ): Promise<ExchangeRateModel | null> {
    const url = `${this.baseUrl}${baseCode}`;
    const response = (await axios.get(url)).data as ExchangeRateResponse;

    if (!this.isSuccessResponse(response)) {
      logger.warn({ message: "Base rate not found", response });
      return null;
    }

    const parsedResponse = exchangeApiSchema.safeParse(response);
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
      logger.warn({ message: "Exchange rate not found", response });
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
