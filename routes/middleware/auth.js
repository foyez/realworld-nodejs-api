const jwt = require('express-jwt'),
  secretOrKey = require('../../config').secretOrKey;

const getTokenFromHeader = req => {
  const authHeader = req.headers.authorization;

  if ((authHeader && authHeader.split(' ')[0] === 'Bearer') || (authHeader && authHeader.split(' ')[0] === 'Token')) {
    return authHeader.split(' ')[1];
  }

  return null;
};

const auth = {
  required: jwt({
    secret: secretOrKey,
    userProperty: 'payload',
    getToken: getTokenFromHeader,
  }),
  optional: jwt({
    secret: secretOrKey,
    userProperty: 'payload',
    credentialsRequired: false,
    getToken: getTokenFromHeader,
  }),
};

module.exports = auth;
