import compression from "compression";
import { compressionConfig } from "../config/compression.config.js";

export const compressionMiddleware = compression(compressionConfig);