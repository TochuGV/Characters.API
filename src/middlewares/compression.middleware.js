import compression from "compression";
import compressionConfiguration from "../configuration/compression.configuration.js";

const compressionMiddleware = compression(compressionConfiguration);

export default compressionMiddleware;