import axios from "axios";
import type { ExchangeRateModel } from "./interfaces/model";

export class ExchangeApi {
  private readonly baseUrl: string = "https://open.er-api.com/v6/latest/";

  public async getExchangeRate(
    baseCode: string,
    exchangeCode: string
  ): Promise<ExchangeRateModel> {
    const url = `${this.baseUrl}${baseCode}`;
    const response = await axios.get(url);

    return {
      baseCode,
      exchangeCode,
      rate: response.data.rates[exchangeCode],
    };
  }
}
