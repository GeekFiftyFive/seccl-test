import { app } from "@app/app";
import request from "supertest";

describe("GET /exchange", () => {
  it("can return valid exchange rate", async () => {
    const response = await request(app).get(
      "/exchange?baseCode=GBP&exchangeCode=USD"
    );

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      exchangeRate: {
        baseCode: "GBP",
        exchangeCode: "USD",
        rate: expect.any(Number),
      },
    });
  });

  it("returns 404 if exchange rate not found", async () => {
    const response = await request(app).get(
      "/exchange?baseCode=GBP&exchangeCode=XXX"
    );

    expect(response.status).toEqual(404);
    expect(response.body).toEqual({
      message: "Exchange rate not found",
    });
  });
});
