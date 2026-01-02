import compression from "compression";
import env from "./enviroment.config.js";

const compressionConfig = {
  threshold: env.COMPRESSION_THRESHOLD,
  level: env.COMPRESSION_LEVEL,
  filter: (req, res) => {
    if (req.headers["x-no-compression"]) return false;
    return compression.filter(req, res);
  }
};

export default compressionConfig;