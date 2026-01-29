import fs from 'fs';
import path from 'path';

const log = {
  info: (msg, data = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${msg}`);
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        console.log(`   • ${key}: ${value}`);
      });
      console.log('');
    }
  },
  error: (msg, data = null) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ❌ ${msg}`);
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        console.error(`   • ${key}: ${value}`);
      });
      console.log('');
    }
  },
  success: (msg, data = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ✅ ${msg}`);
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        console.log(`   • ${key}: ${value}`);
      });
      console.log('');
    }
  }
};

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
  log.info(`Created logs directory: ${CONFIG.logsDir}`);
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
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    // Extraer solo los datos (sin el wrapper de "status" y "data")
    const metrics = result.data || result;
    
    writeLogLine(METRICS_LOG, metrics);
    
    log.success('Metrics logged', {
      totalRequests: metrics.http?.totalRequests || 0,
      uptime: metrics.uptime
    });
    
  } catch (error) {
    log.error('Failed to fetch metrics', {
      endpoint: '/metrics',
      error: error.message
    });
  }
};

const fetchAndLogHealth = async () => {
  try {
    const response = await fetch(`${CONFIG.baseUrl}/health`);
    
    const result = await response.json();
    
    const health = result.data || result;
    
    writeLogLine(HEALTH_LOG, health);
    
    const statusIcon = health.status === 'UP' ? '✅' : 
                      health.status === 'DEGRADED' ? '⚠️' : '❌';
    
    log.info(`${statusIcon} Health logged`, {
      status: health.status,
      dbResponseTime: health.services?.database?.responseTime
    });
    
  } catch (error) {
    log.error('Failed to fetch health', {
      endpoint: '/health',
      error: error.message
    });
  }
};

const runMonitoringCycle = async () => {
  await Promise.all([
    fetchAndLogMetrics(),
    fetchAndLogHealth()
  ]);
};

const startMonitor = async () => {
  console.log('\n========================================');
  console.log('   📊 Monitoring Script Started');
  console.log('========================================');
  console.log(`Metrics log:  ${METRICS_LOG}`);
  console.log(`Health log:   ${HEALTH_LOG}`);
  console.log(`Interval:     ${CONFIG.interval / 1000}s`);
  console.log(`Base URL:     ${CONFIG.baseUrl}`);
  console.log('========================================\n');

  // Primera ejecución inmediata
  log.info('Running initial check...');
  await runMonitoringCycle();
  
  // Configurar ejecución periódica
  setInterval(async () => {
    await runMonitoringCycle();
  }, CONFIG.interval);

  log.info(`Monitoring active. Logging every ${CONFIG.interval / 1000} seconds...`);
};

process.on('SIGINT', () => {
  console.log('\n');
  log.info('Shutting down monitor...');
  log.info(`Logs saved in: ${CONFIG.logsDir}`);
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n');
  log.info('Shutting down monitor...');
  log.info(`Logs saved in: ${CONFIG.logsDir}`);
  process.exit(0);
});

startMonitor().catch((error) => {
  log.error('Fatal error starting monitor', { error: error.message });
  process.exit(1);
});