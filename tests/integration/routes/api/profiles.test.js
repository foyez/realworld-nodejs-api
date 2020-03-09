const request = require('supertest');
const mongoose = require('mongoose');
const { User } = require('../../../../models/User');

let server;

describe('tags endpoints', () => {
  let id;
  let user;

  beforeEach(() => {
    server = require('../../../../app');
  });
  afterEach(async () => {
    await User.deleteMany();
    await server.close();
  });

  it('should return a list of tags', async () => {
    const user = new User({ username: 'foyez', email: 'foyez@email.com', password: 'testpass' });
    await user.save();

    const res = await request(server).get('/api/profiles/foyez');

    expect(res.status).toBe(200);
    // expect(res.body).toHaveProperty('test');
  });
});
