import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define log colors
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

winston.addColors(colors);

// Define log format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Define console format (for development)
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}${info.stack ? '\n' + info.stack : ''}`
  )
);

// Define transports
const transports = [
  // Write all logs to console
  new winston.transports.Console({
    format: consoleFormat,
  }),

  // Write all logs with level 'error' and below to error.log
  new winston.transports.File({
    filename: path.join(__dirname, '../../logs/error.log'),
    level: 'error',
    format,
  }),

  // Write all logs to combined.log
  new winston.transports.File({
    filename: path.join(__dirname, '../../logs/combined.log'),
    format,
  }),
];

// Create logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'debug',
  levels,
  format,
  transports,
  // Don't exit on handled exceptions
  exitOnError: false,
});

// Create logs directory if it doesn't exist
import fs from 'fs';
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Stream for Morgan HTTP logging
logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

export default logger;
