const jwt = require('express-jwt'),
  secretOrKey = require('../../config').secretOrKey;

const getTokenFromHeader = req => {
  if (
    req.headers.authorization &&
    (req.headers.authorization.split(' ')[0] === 'Token' || req.headers.authorization.split(' ')[0] === 'Bearer')
  ) {
    return req.headers.authorization.split(' ')[1];
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
