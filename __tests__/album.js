/* eslint-env node, jest */
const Commando = require('discord.js-commando');
const AlbumCommands = require('../src/commands/album/album');
const mongoose = require('mongoose');
const expect = require('expect');

const client = new Commando.Client();
const album = new AlbumCommands(client);

describe('Test for album command', () => {
  beforeAll(() => {
    mongoose.Promise = Promise;
    mongoose.connect('mongodb://localhost/mappabot', { useMongoClient: true });
  });

  afterAll((done) => {
    mongoose.disconnect(done);
  });

  it('should return photo length', async () => {
    expect.assertions(1);
    const len = await album.getPhotosLength();

    expect(len).toBeGreaterThanOrEqual(0);
  });

  it('should return a random photo', async () => {
    expect.assertions(1);
    const photo = await album.getRandomPhoto();

    expect(photo).toBeTruthy();
  });
});
