import { rootHandler } from "@app/handlers/root.handler";
import express from "express";
import { loggerInstance } from "./logger";
import { exchangeHandler } from "@app/handlers/exchange.handler";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export const app = express();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Exchange Rate API",
      version: "1.0.0",
      description: "API for retrieving exchange rates",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
  },
  apis: ["./src/app.ts"],
};

const specs = swaggerJSDoc(options);

app.use(loggerInstance);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health Check
 *     responses:
 *       200:
 *         description: Result of health check
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 healthy:
 *                   type: boolean
 *                   description: Whether the service is healthy
 */
app.get("/", rootHandler);

/**
 * @swagger
 * /exchange:
 *   get:
 *     summary: Get Exchange Rate
 *     description: Returns the exchange rate between two currencies
 *     parameters:
 *       - name: baseCode
 *         in: query
 *         description: The base currency code
 *         required: true
 *         schema:
 *           type: string
 *       - name: exchangeCode
 *         in: query
 *         description: The exchange currency code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Exchange rate
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exchangeRate:
 *                   type: object
 *                   properties:
 *                     baseCode:
 *                       type: string
 *                       description: The base currency code
 *                     exchangeCode:
 *                       type: string
 *                       description: The exchange currency code
 *                     rate:
 *                       type: number
 *                       description: The exchange rate
 *       404:
 *         description: Exchange rate not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 *       500:
 *         description: Failed to get exchange rate
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 *                 error:
 *                   type: object
 *                   description: The error details
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 *                 issues:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: string
 *                         description: The error code
 *                       expected:
 *                         type: string
 *                         description: The expected value
 *                       received:
 *                         type: string
 *                         description: The received value
 *                       path:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: The path to the error
 *                       message:
 *                         type: string
 *                         description: The error message
 */
app.get("/exchange", exchangeHandler);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
