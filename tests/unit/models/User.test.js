const mongoose = require('mongoose');
const User = require('../../../models/User');
const jwt = require('jsonwebtoken');
const secretOrKey = require('../../../config').secretOrKey;

describe('UserSchema.generateJWT', () => {
  it('should return a valid JWT', () => {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      username: 'foyez',
      exp: parseInt(exp.getTime() / 1000),
    };

    const user = new User(payload);
    const token = user.generateJWT();
    const decoded = jwt.verify(token, secretOrKey);

    expect(decoded).toMatchObject(payload);
  });
});
