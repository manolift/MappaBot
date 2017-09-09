const Commando = require('discord.js-commando');
const user = require('../../modules/user');

module.exports = class FirstCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'toss',
      aliases: ['toss'],
      group: 'games',
      memberName: 'game',
      description: 'Pile ou face',
      details: 'Pile ou face',
      examples: ['!toss pile'],
      argsCount: 1,
      args: [
        {
          key: 'value',
          label: 'Pile ou Face',
          prompt: 'Choisi pile ou face',
          type: 'string',
        },
      ],
    });
  }

  randomNumber() {
    return Math.random();
  }

  hasWon(val, choice) {
    const faceWon = val < 0.5 && choice === 'face';
    const pileWon = val > 0.5 && choice === 'pile';

    if (faceWon || pileWon) {
      return true;
    }

    return false;
  }

  run(message, { value }) {
    const normalize = str => str.toLowerCase().trim();
    const valid = normalize(value) === 'pile' || normalize(value) === 'face';
    const randomValue = this.randomNumber();

    if (valid) {
      if (this.hasWon(randomValue, value)) {
        user.giveMoney(message.channel, message.author.id, 50);
      } else {
        message.channel.send(':robot: Perdu VICTIME :robot:');
      }
    }
  }
};
