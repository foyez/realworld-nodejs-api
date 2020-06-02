const router = require('express').Router();

router.use('/', require('./users'));
router.use('/profiles', require('./profiles'));
router.use('/articles', require('./articles'));
router.use('/tags', require('./tags'));
router.use('/docs', require('../swagger/swaggerMiddleware'));

module.exports = router;
