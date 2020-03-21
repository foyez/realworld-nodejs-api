const dbHandler = require('../../../../loaders/mongoose');
const { User } = require('../../../../models/User');

const supertest = require('supertest');
const app = require('../../../../app');
const request = supertest.agent(app);

describe('/api/profiles', () => {
  /**
   * Connect to a new in-memory database before running any tests.
   */
  // beforeAll(async () => await dbHandler.connect());

  /**
   * Clear all test data after every test.
   */
  afterEach(async () => {
    // await app.close();
    await dbHandler.clearDatabase();
  });

  /**
   * Remove and close the db and server.
   */
  afterAll(async () => {
    await app.close();
    await dbHandler.closeDatabase();
  });

  describe('GET /:username', () => {
    let users;
    let username;
    let token;

    const exec = () => request.get(`/api/profiles/${username}`);

    beforeEach(async () => {
      users = [
        {
          username: 'foyez',
          email: 'foyez@email.com',
          password: 'testpass',
        },
        { username: 'rumon', email: 'rumon@email.com', password: 'testpass' },
      ];
      // const newUser = new User(user);
      const newUsers = await User.collection.insertMany(users);
      // await newUser.save();

      token = new User().generateJWT();
    });

    it('should return 404 if username is invalid', async () => {
      username = 'aaaaa';

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return a list of tags', async () => {
      username = users[0].username;
      token = '';

      const res = await exec();

      expect(res.status).toBe(200);
    });

    it('should return a profile', async () => {
      username = users[0].username;

      const res = await exec();

      expect(res.body.profile).toMatchObject({ username });
    });
  });
});
