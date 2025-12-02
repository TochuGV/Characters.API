import compression from "compression";
import compressionConfig from "../config/compression.config.js";

const compressionMiddleware = compression(compressionConfig);

export default compressionMiddleware;