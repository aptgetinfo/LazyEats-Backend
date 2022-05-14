const mongoose = require('mongoose');

process.on('uncaughtException', (error) => {
  console.log('🔴 UNCAUGHT EXCEPTION!');
  console.info(error.name, error.message);
  console.info('⚠️ Server Closed!');
  process.exit(1);
});

const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('🟡 DB connection successful!');
  server = app.listen(config.port, () => {
    logger.info(`🟢 Listening to port ${config.port}`);
  });
});

process.on('unhandledRejection', (error) => {
  logger.info('🔴 UNHANDLED REJECTION!');
  logger.info(error.name, error.message);
  if (server) {
    server.close(() => {
      logger.info('⚠️ Server Closed!');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on('SIGTERM', () => {
  logger.info('🔴 SIGTERM RECEIVED!');
  if (server) {
    server.close(() => {
      logger.info('⚠️ Server Closed!');
    });
  }
});
