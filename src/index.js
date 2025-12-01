import app from "./app.js"
import logger from "./logger/index.js"

const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send("Hello World!"));

app.listen(port, ()=>{
  logger.info(`Server running on port ${port}`);
});