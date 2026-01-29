import metricsCollector from "../collectors/metrics.collector.js";
import tryCatch from "../utils/try-catch.js";
import successResponse from "../utils/response.util.js";
import logger from "../logger/index.js";

const getMetrics = tryCatch(async (req, res) => {
  logger.debug("[GET] /metrics - Fetching system metrics");
  const metrics = metricsCollector.getMetrics();
  return successResponse(res, metrics);
});

export default getMetrics;
