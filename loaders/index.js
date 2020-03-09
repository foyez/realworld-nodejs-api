const expressLoader = require('./express');
const mongooseLoader = require('./mongoose');
const Logger = require('./logger');

module.exports = async app => {
  try {
    const dbConnection = await mongooseLoader();
    Logger.info(`DB loaded and connected to: ${dbConnection.connections[0].name}`);

    // Load Models
    require('../models/User');
    require('../models/Article');
    require('../models/Comment');

    // Load passport Middleware
    require('../config/passport');

    await expressLoader(app);
    Logger.info('Express loaded');
  } catch (err) {
    Logger.error(err.message);
  }
};
