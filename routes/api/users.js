const router = require('express').Router();
// const { User, validateLogin } = require('../../models/User');
const mongoose = require('mongoose');
const User = mongoose.model('User');

router.post('/users', async (req, res, next) => {
  // const { error } = validateLogin(req.body.user);
  // if (error) return next(error);

  const { username, name } = req.body.user;
  let user = new User();
  user.username = username;
  user.name = name;

  try {
    user = await user.save();
    return res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
