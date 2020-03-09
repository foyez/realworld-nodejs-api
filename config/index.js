const envFound = require('dotenv').config();

if (!envFound) {
  throw new Error("Couldn't find .env file");
}

// required variables
const ENV_VARS = ['MONGODB_URI'];

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',

  // DATABASE
  dbName: process.env.DB_NAME,
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbHostName: process.env.DB_HOST_NAME,

  // JWT SECRET
  secretOrKey: process.env.SECRET_OR_KEY,

  // Preferred port
  port: parseInt(process.env.PORT || 5000),

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },

  get mongodbUri() {
    if (this.nodeEnv === 'test') {
      return process.env.TEST_DB_URI;
    }

    return `mongodb://${this.dbUsername}:${this.dbPassword}@${this.dbHostName}/${this.dbName}`;
  },

  checkEnvVariables: () => {
    ENV_VARS.forEach(key => {
      if (!process.env[key]) {
        throw new Error('ERROR: Missing the environment variable ' + key);
      } else {
        // Check that urls use https
        if ([].includes(key)) {
          const url = process.env[key];
          if (!url.startsWith('https://')) {
            console.log('WARNING: Your ' + key + ' does not begin with "https://"');
          }
        }
      }
    });
  },
};
