import statusMonitor from "express-status-monitor";

const monitorOptions = {
  title: 'Characters API Status',
  path: '/status',
  spans: [
    {
      interval: 1,
      retention: 60
    },
    {
      interval: 5,
      retention: 60
    },
    {
      interval: 15,
      retention: 60
    }
  ],
  chartVisibility: {
    cpu: true,
    mem: true,
    load: true,
    responseTime: true,
    rps: true,
    statusCodes: true
  },
  healthChecks: []
};

export default statusMonitor(monitorOptions);