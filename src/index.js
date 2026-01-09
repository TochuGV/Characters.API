import app from "./app.js"
import env from "./config/enviroment.config.js";
import logger from "./logger/index.js"

const port = env.PORT;

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});