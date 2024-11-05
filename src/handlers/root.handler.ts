import { logger } from "@app/logger";
import type { Request, Response } from "express";

export const rootHandler = (_req: Request, res: Response) => {
	logger.info("Hello World!");

	res.send("Hello World!");
};
