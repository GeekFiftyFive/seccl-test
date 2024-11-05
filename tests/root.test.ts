import { app } from "@app/app";
import request from "supertest";

describe("GET /", () => {
	it("returns Hello World!", async () => {
		const response = await request(app).get("/");

		expect(response.status).toEqual(200);
		expect(response.text).toEqual("Hello World!");
	});
});
