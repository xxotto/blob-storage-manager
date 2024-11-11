const winston = require('winston');

const customLevels = {
  levels: {
    info: 0,
    warn: 1,
    error: 2,
    success: 3,
    debug: 4,
  },
};

const logger = winston.createLogger({
  levels: customLevels.levels,
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}] - ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      level: 'debug',
    }),
  ],
});

module.exports = { logger };
