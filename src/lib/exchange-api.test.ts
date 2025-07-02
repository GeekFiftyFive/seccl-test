import MockAdapter from "axios-mock-adapter";
import { ExchangeApi } from "./exchange-api";
import axios from "axios";

describe("ExchangeApi", () => {
  let exchangeApiClient: ExchangeApi;
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
    exchangeApiClient = new ExchangeApi();
  });

  afterEach(() => {
    mock.reset();
  });

  it("should return exchange rate", async () => {
    mock.onGet("https://open.er-api.com/v6/latest/GBP").reply(200, {
      result: "success",
      base_code: "GBP",
      rates: {
        USD: 0.81,
      },
    });

    const exchangeRate = await exchangeApiClient.getExchangeRate("GBP", "USD");

    expect(exchangeRate).toEqual({
      baseCode: "GBP",
      exchangeCode: "USD",
      rate: 0.81,
    });
  });
});
