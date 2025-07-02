import { rootHandler } from "@app/handlers/root.handler";
import express from "express";
import { loggerInstance } from "./logger";
import { exchangeHandler } from "./handlers/exchange.handler";

export const app = express();

app.use(loggerInstance);

app.get("/", rootHandler);
app.get("/exchange", exchangeHandler);
