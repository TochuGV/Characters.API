import fs from 'fs';
import path from 'path';
import pino from 'pino';

const logger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: "SYS:dd-mm-yyyy HH:MM:ss.l",
      ignore: 'pid,hostname'
    }
  }
});

const CONFIG = {
  baseUrl: "http://localhost:3000",
  interval: 30000,
  logsDir: './logs',
  files: {
    metrics: 'metrics.log',
    health: 'health.log'
  }
};

if (!fs.existsSync(CONFIG.logsDir)) {
  fs.mkdirSync(CONFIG.logsDir, { recursive: true });
  logger.info(`Created logs directory: ${CONFIG.logsDir}`);
};

const METRICS_LOG = path.join(CONFIG.logsDir, CONFIG.files.metrics);
const HEALTH_LOG = path.join(CONFIG.logsDir, CONFIG.files.health);

const writeLogLine = (filepath, data) => {
  const logLine = JSON.stringify(data) + '\n';
  fs.appendFileSync(filepath, logLine);
};

const fetchAndLogMetrics = async () => {
  try {
    const response = await fetch(`${CONFIG.baseUrl}/metrics`);
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

    const result = await response.json();
    const metrics = result.data || result;
    
    writeLogLine(METRICS_LOG, metrics);
    
    logger.info({
      totalRequests: metrics.http?.totalRequests || 0,
      uptime: metrics.uptime
    }, 'Metrics logged');
  } catch (error) {
    logger.error({
      endpoint: '/metrics',
      error: error.message
    }, 'Failed to fetch metrics');
  }
};

const fetchAndLogHealth = async () => {
  try {
    const response = await fetch(`${CONFIG.baseUrl}/health`);
    const result = await response.json();
    const health = result.data || result;
    
    writeLogLine(HEALTH_LOG, health);
    
    logger.info({
      status: health.status,
      databaseResponseTime: health.services?.database?.responseTime
    }, 'Health logged');
    
  } catch (error) {
    logger.error({
      endpoint: '/health',
      error: error.message
    }, 'Failed to fetch health');
  }
};

const runMonitoringCycle = async () => {
  await Promise.all([
    fetchAndLogMetrics(),
    fetchAndLogHealth()
  ]);
};

const startMonitor = async () => {
  console.log('========================================');
  console.log('   📊 Monitoring Script Started');
  console.log('========================================');
  console.log(`Metrics log:  ${METRICS_LOG}`);
  console.log(`Health log:   ${HEALTH_LOG}`);
  console.log(`Interval:     ${CONFIG.interval / 1000}s`);
  console.log(`Base URL:     ${CONFIG.baseUrl}`);
  console.log('========================================\n');

  logger.info('Running initial check...');
  await runMonitoringCycle();

  setInterval(async () => {
    await runMonitoringCycle();
  }, CONFIG.interval);

  logger.info(`Monitoring active. Logging every ${CONFIG.interval / 1000} seconds...`);
};

process.on('SIGINT', () => {
  logger.debug('Shutting down monitor...');
  logger.debug(`Logs saved in: '${CONFIG.logsDir}'`);
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.debug('Shutting down monitor...');
  logger.debug(`Logs saved in: '${CONFIG.logsDir}'`);
  process.exit(0);
});

startMonitor().catch((error) => {
  logger.error('Fatal error starting monitor', { error: error.message });
  process.exit(1);
});