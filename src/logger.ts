import pinoLogger from "pino-http";

export const loggerInstance = pinoLogger();
export const logger = loggerInstance.logger;
