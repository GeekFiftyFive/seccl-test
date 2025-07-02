import { app } from "@app/app";
import { logger } from "./logger";

const port = 3000;

app.listen(port, () => {
  logger.info(`Example app listening on port ${port}`);
});
