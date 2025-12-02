import app from "./app.js"
import env from "./configuration/enviroment.configuration.js";
import logger from "./logger/index.js"

const port = env.PORT;

app.get('/', (req, res) => res.send("Hello World!"));

app.listen(port, ()=>{
  logger.info(`Server running on port ${port}`);
});