/* eslint-env node, jest */
const Commando = require('discord.js-commando');
const RollCommands = require('../src/commands/games/roll');
const path = require('path');

const client = new Commando.Client();
client.registry
  .registerGroups([
    ['sounds', 'Soundbox'],
    ['album', 'Album Mappa'],
    ['first', 'Chope le first'],
    ['games', 'Mini jeux'],
    ['infos', 'Informations'],
    ['bank', 'Informations bancaires'],
    ['rob', 'Voler un utilisateur'],
  ])
  .registerDefaults()
  .registerCommandsIn(path.join(__dirname, '..', 'src', 'commands'));

const roll = new RollCommands(client);

describe('Get random int between 0 and 100', () => {
  it('should at least go to zero inclusive', () => {
    const TEST_VALUE = 0;
    const tmp = [];

    while (!tmp.includes(TEST_VALUE)) {
      tmp.push(roll.randomNumber);
    }

    expect(tmp.includes(TEST_VALUE)).toBe(true);
  });

  it('should at least go to 100 inclusive', () => {
    const TEST_VALUE = 100;
    const tmp = [];

    while (!tmp.includes(TEST_VALUE)) {
      tmp.push(roll.randomNumber);
    }

    expect(tmp.includes(TEST_VALUE)).toBe(true);
  });
});

describe('Determine if player has won or not', () => {
  beforeAll(() => {
    roll.min = 30;
    roll.max = 100;
  });

  it('should win if random number is between min and max', () => {
    const RANDOM_NUMBER_WIN = 50;

    expect(roll.hasWon(RANDOM_NUMBER_WIN)).toBe(true);
  });

  it('should loose if random number is not between min and max', () => {
    const RANDOM_NUMBER_WIN = 20;

    expect(roll.hasWon(RANDOM_NUMBER_WIN)).toBe(false);
  });
});


describe('Get amount by a given threshold', () => {
  beforeAll(() => {
    roll.min = 50;
    roll.max = 100;
  });

  it('return correct amount for a given range double for half chance', () => {
    const VALUE = 100;
    const amount = roll.getAmountByThreshold(VALUE);

    expect(amount).toBe(VALUE * 2);
  });

  it('should get 1K5 for exact number with base 100', () => {
    roll.min = 50;
    roll.max = 50;

    const VALUE = 100;
    const amount = roll.getAmountByThreshold(VALUE);

    expect(amount).toBe(15000);
  });
});


describe('Validate minimum space to prevent spam', () => {
  it('throw if space is < 20', () => {
    expect(roll.isSpaceValid(19, 100)).toBe(false);
  });

  it('validate is space >= 20', () => {
    expect(roll.isSpaceValid(0, 80)).toBe(true);
  });
});
