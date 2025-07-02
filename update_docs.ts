import { writeFileSync } from "node:fs";
import swaggerJSDoc from "swagger-jsdoc";

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

writeFileSync("docs/schema.json", JSON.stringify(specs));
