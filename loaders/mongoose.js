const mongoose = require('mongoose');
const mongodbUri = require('../config').mongodbUri;

module.exports = () => {
  return mongoose.connect(mongodbUri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  });
};
