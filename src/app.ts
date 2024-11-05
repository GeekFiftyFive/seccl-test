import { rootHandler } from "@app/handlers/root.handler";
import express from "express";
import { loggerInstance } from "./logger";

export const app = express();

app.use(loggerInstance);

app.get("/", rootHandler);
