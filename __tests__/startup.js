/* eslint-env node, jest */

const env = require('dotenv');
const Commando = require('discord.js-commando');
const mongoose = require('mongoose');
const moment = require('moment');

const client = new Commando.Client({ owner: process.env.OWNER_ID });
describe('App startup', () => {
  beforeAll(() => {
    env.config();
  });

  it('should load config env', () => {
    expect(process.env.OWNER_ID).toBeDefined();
  });

  it('should load Commando Client', () => {
    expect(client).toBeDefined();
  });

  it('should connect to Mongo and match Semver version', () => {
    mongoose.connect('mongodb://localhost/mappabot', { useMongoClient: true }, () => {
      const admin = new mongoose.mongo.Admin(mongoose.connection.db);
      admin.buildInfo((err, info) => {
        // eslint-disable-next-line
        expect(info.version).toMatch(/\bv?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[\da-z\-]+(?:\.[\da-z\-]+)*)?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?\b/gi);
      });
    });
  });

  it('should define time left before midnight', () => {
    const tomorrowMidnight = moment()
      .add(1, 'day')
      .startOf('day');
    const tstampLeft = tomorrowMidnight.diff(moment());

    expect(tstampLeft).toBeTruthy();
  });
});
