const router = require('express').Router();
const { User, validateLogin } = require('../../models/User');
const passport = require('passport');
const auth = require('../middleware/auth');

// GET USER
router.get('/user', auth.required, async (req, res, next) => {
  try {
    const user = await User.findById(req.payload.id);

    if (!user) return res.sendStatus(401);

    return res.json({ user: user.toAuthJSON() });
  } catch (err) {
    next(err);
  }
});

// UPDATE USER
router.put('/user', auth.required, async (req, res, next) => {
  try {
    let user = await User.findById(req.payload.id);

    if (!user) return res.sendStatus(401);

    const { username, password, email, bio, image } = req.body.user;

    if (typeof username !== 'undefined') user.username = username;
    if (typeof password !== 'undefined') user.setPassword(password);
    if (typeof email !== 'undefined') user.email = email;
    if (typeof bio !== 'undefined') user.bio = bio;
    if (typeof image !== 'undefined') user.image = image;

    user = await user.save();

    return res.json({ user: user.toAuthJSON() });
  } catch (err) {
    next(err);
  }
});

// LOGIN
// router.post('/users/login', (req, res, next) => {
//   const { error } = validateLogin(req.body.user);
//   if (error) return next(error);

//   passport.authenticate('local', { session: false }, (err, user, info) => {
//     if (err) return next(err);

//     if (user) {
//       user.token = user.generateJWT();

//       return res.status(200).json({ user: user.toAuthJSON() });
//     } else {
//       return res.status(422).json(info);
//     }
//   })(req, res, next);
// });

const refreshTokens = {};

// LOGIN
router.post('/users/login', (req, res, next) => {
  const { error } = validateLogin(req.body.user);
  if (error) return next(error);

  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) return next(err);

    if (user) {
      user.token = user.generateJWT();
      user.refreshToken = user.generateRefreshToken();
      refreshTokens[user.refreshToken] = user.username;

      return res.status(200).json({ user: user.toAuthJSON() });
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
});

// GENERATE ACCESS TOKEN WITH REFRESH TOKEN
router.post('/token', (req, res, next) => {
  const { username, refreshToken } = req.body;

  if (refreshToken in refreshTokens && refreshTokens[refreshToken] === username) {
    const user = new User();
    const token = user.generateJWT();

    res.json({ token });
  } else {
    res.send(401);
  }
});

// DELETE REFRESH TOKEN
router.delete('/token/reject', (req, res, next) => {
  const { refreshToken } = req.body;

  if (refreshToken in refreshTokens) {
    delete refreshTokens[refreshToken];
  }

  res.send(204);
});

// REGISTER
router.post('/users', async (req, res, next) => {
  const { username, email, password } = req.body.user;
  let user = new User();

  user.username = username;
  user.email = email;
  user.setPassword(password);

  try {
    user = await user.save();
    return res.status(201).json({ user: user.toAuthJSON() });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
