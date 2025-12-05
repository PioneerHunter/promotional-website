const path = require('path');

// 环境检测
const isProduction = process.env.PM2_ENV === 'production' ||
  process.env.NODE_ENV === 'production';

// 路径配置
const config = {
  local: {
    cwd: process.cwd(),
    error_file: path.join(process.cwd(), 'logs', 'err.log'),
    out_file: path.join(process.cwd(), 'logs', 'out.log'),
  },
  production: {
    cwd: '/app/promotional-website',
    error_file: '/var/log/pm2/promotional-website-error.log',
    out_file: '/var/log/pm2/promotional-website-out.log',
  }
};

const envConfig = isProduction ? config.production : config.local;

module.exports = {
  apps: [{
    name: 'promotional-website',
    script: 'pnpm',  // 或 'npm'
    args: 'start',
    cwd: envConfig.cwd,
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      GITHUB_WEBHOOK_SECRET: process.env.GITHUB_WEBHOOK_SECRET || ''
    },
    error_file: envConfig.error_file,
    out_file: envConfig.out_file,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
}