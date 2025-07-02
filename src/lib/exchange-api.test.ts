import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { ExchangeApiClient } from "./exchange-api";
import * as retry from "../utils/retry";

describe("ExchangeApi", () => {
  let exchangeApiClient: ExchangeApiClient;
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
    exchangeApiClient = new ExchangeApiClient();

    // Enable fake timers before each test
    jest.useFakeTimers({ advanceTimers: true });
    // Spy on setTimeout to inspect calls
    jest.spyOn(global, "setTimeout");
    jest.spyOn(retry, "retry");
  });

  afterEach(() => {
    // Clean up after each test
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
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

  it("should exponentially backoff on 429 responses", async () => {
    mock.onGet("https://open.er-api.com/v6/latest/GBP").reply(429, {
      result: "error",
      "error-type": "too-many-requests",
    });

    await expect(
      exchangeApiClient.getExchangeRate("GBP", "USD")
    ).rejects.toThrow("too-many-requests");
    expect(mock.history.get.length).toBe(3);
    expect(retry.retry).toHaveBeenCalledTimes(1);
  });

  it("should instantly return error if not retryable", async () => {
    mock.onGet("https://open.er-api.com/v6/latest/GBP").reply(500, {
      result: "error",
      "error-type": "internal-server-error",
    });

    await expect(
      exchangeApiClient.getExchangeRate("GBP", "USD")
    ).rejects.toThrow("internal-server-error");
    expect(mock.history.get.length).toBe(1);
    expect(retry.retry).toHaveBeenCalledTimes(1);
  });
});
