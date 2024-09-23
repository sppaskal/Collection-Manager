import winston from 'winston'
import path from 'path'
import config from '../config/config.js'

const { combine, timestamp, printf, colorize } = winston.format

// Define custom format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`
})

// Create winston logger
const logger = winston.createLogger({
  level: config.loggingLevel,
  format: combine(
    timestamp(),
    colorize(),
    logFormat
  ),
  transports: [
    // Log to a file (for production)
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error' // Log only errors in this file
    }),
    new winston.transports.File({
      filename: path.join('logs', 'combined.log')
    }),
    // Log to console (for development)
    new winston.transports.Console({
      format: combine(
        colorize(),
        logFormat
      )
    })
  ]
})

export default logger
