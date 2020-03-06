const router = require('express').Router();
const api = require('../config').api;

router.use(api.prefix, require('./api'));

module.exports = router;
