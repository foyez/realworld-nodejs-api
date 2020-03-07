const router = require('express').Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const passport = require('passport');
const auth = require('../middleware/auth');

// Preload article objects on routes with ':username'
router.param('username', async (req, res, next, username) => {
  try {
    const user = await User.findOne({ username });

    if (!user) return res.sendStatus(404);

    req.profile = user;

    return next();
  } catch (err) {
    next(err);
  }
});

// GET PROFILE USING USERNAME
router.get('/:username', auth.optional, (req, res, next) => {
  if (req.payload) {
    const user = User.findById(req.payload.id);

    if (!user)
      return res.json({
        profile: req.profile.toProfileJSONFor(false),
      });

    return res.json({ profile: req.profile.toProfileJSONFor(user) });
  } else {
    return res.json({
      profile: req.profile.toProfileJSONFor(false),
    });
  }
});

module.exports = router;
