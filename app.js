const express = require('express');

const config = require('./config');
const Logger = require('./loaders/logger');

const startServer = async () => {
  const app = express();

  await require('./loaders')(app);

  const server = app.listen(config.port, err => {
    if (err) {
      Logger.error(err);
      process.exit(1);
    }

    Logger.info('Server listening on port: ' + server.address().port);
  });
};

startServer();
