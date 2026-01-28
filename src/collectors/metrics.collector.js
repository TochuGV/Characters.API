class MetricsCollector {
  constructor() {
    this.requests = {
      total: 0,
      byMethod: {},
      byStatus: {},
      responseTimes: []
    };
  };

  recordRequest(method, status, responseTime) {
    this.requests.total++;

    this.requests.byMethod[method] = (this.requests.byMethod[method] || 0) + 1

    const statusRange = `${Math.floor(status / 100)}xx`;
    this.requests.byStatus[statusRange] = (this.requests.byStatus[statusRange] || 0) + 1

    this.requests.responseTimes.push(responseTime);

    if (this.requests.responseTimes.length > 1000) { // Revisar CircularBuffer
      this.requests.responseTimes.shift();
    }
  };

  getAverageResponseTime() {
    if (this.requests.responseTimes.length === 0) return 0;
    const sum = this.requests.responseTimes.reduce((acc, time) => acc + time, 0);
    const avg = sum / this.requests.responseTimes.length;
    return Math.round(avg * 100) / 100
  }

  getMetrics() {
    const memoryUsage = process.memoryUsage();
    return {
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      process: {
        memoryUsageMB: Math.round(memoryUsage.rss / 1024 / 1024),
        heapUsedMB: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      },
      http: {
        totalRequests: this.requests.total,
        requestsByMethod: this.requests.byMethod,
        requestsByStatus: this.requests.byStatus,
        averageResponseTimeMs: this.getAverageResponseTime()
      }
    };
  };
};

export default new MetricsCollector();