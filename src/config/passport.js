const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  mongoose = require('mongoose'),
  User = mongoose.model('User');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'user[email]',
      passwordField: 'user[password]',
    },
    (email, password, done) => {
      User.findOne({ email })
        .then(user => {
          if (!user || !user.validPassword(password)) {
            return done(null, false, { errors: { 'email or password': 'is invalid' } });
          }

          return done(null, user);
        })
        .catch(done);
    },
  ),
);
