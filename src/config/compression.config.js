import compression from "compression";
import env from "./environment.config.js";

const compressionOptions = {
  threshold: env.COMPRESSION_THRESHOLD,
  level: env.COMPRESSION_LEVEL,
  filter: (req, res) => {
    if (req.headers["x-no-compression"]) return false;
    return compression.filter(req, res);
  }
};

export default compression(compressionOptions); 