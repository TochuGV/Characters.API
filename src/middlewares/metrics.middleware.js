import metricsCollector from "../collectors/metrics.collector.js";

const metricsMiddleware = (req, res, next) => {
  if (req.path === '/metrics' || req.path === '/health') return next();
  const startTime = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    metricsCollector.recordRequest(req.method, res.statusCode, duration);
  });
  next();
};

export default metricsMiddleware;