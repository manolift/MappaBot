/* eslint-env node, jest */
const expect = require('expect');
const mongoose = require('mongoose');
const user = require('../../src/modules/user');
const User = require('../../src/db/models/user');

const DEFAULT_MONEY_USER = 50;

describe('Test for album command', () => {
  beforeAll(() => {
    mongoose.Promise = Promise;
    mongoose.connect('mongodb://localhost/mappabot', {
      useMongoClient: true,
    });
  });

  beforeEach(async () => {
    const mockUser = new User({ userId: 1 });
    await mockUser.save();
  });

  afterEach(async () => {
    await User.remove({ userId: 1 });
    await User.remove({ userId: 2 });
  });

  afterAll((done) => {
    mongoose.disconnect(done);
  });

  it('should get an user by its id', async () => {
    expect.assertions(1);
    const __user__ = await user.get(1);

    expect(__user__).toBeTruthy();
  });

  it('should get defaulted to 50 kebabs', async () => {
    expect.assertions(1);
    const __user__ = await user.get(1);

    expect(__user__.kebabs).toEqual(DEFAULT_MONEY_USER);
  });

  it('should return an array of users', async () => {
    expect.assertions(1);
    const users = await user.users;

    expect(Array.isArray(users)).toBe(true);
  });

  it('should update user', async () => {
    expect.assertions(1);
    const __user__ = await user.userQuery(1, 50);

    expect(__user__.kebabs).toEqual(100);
  });

  it('should upsert new user', async () => {
    expect.assertions(1);

    const __user__ = await user.userQuery(2, 50);

    expect(__user__.kebabs).toEqual(50);
  });

  it('should give money when first', async () => {
    expect.assertions(1);
    user.didFirst(1, user.firstGive);
    const __user__ = await User.findOne({ userId: 1 });

    expect(__user__.kebabs).toEqual(DEFAULT_MONEY_USER + user.firstGive);
  });

  it('should create new user if not here in database', async () => {
    expect.assertions(1);
    const registered = await user.register(1);

    expect(registered).toBe(true);
  });

  it('should not create new user if here in database', async () => {
    expect.assertions(1);
    const registered = await user.register(2);

    expect(registered).toBe(false);
  });

  it('should update all user for n kebabs', async () => {
    expect.assertions(1);
    const newUser = new User({ userId: 2 });
    newUser.save();

    await user.giveDaily();
    const firstUser = await user.get(1);
    const secondUser = await user.get(2);

    const toGive = DEFAULT_MONEY_USER + (user.defaultGive * 2);

    expect([firstUser.kebabs, secondUser.kebabs]).toEqual([toGive, toGive]);
  });

  it('should give to one and remove for one if enough money', async () => {
    expect.assertions(1);
    const hasGiven = await user.giveTo(1, 2, 10);

    expect(hasGiven).toBe(true);
  });

  it('should throw if trying to give too much money', async () => {
    expect.assertions(1);
    const hasGiven = await user.giveTo(1, 2, 60);

    expect(hasGiven).toBe(false);
  });
});
