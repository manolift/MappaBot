const Commando = require('discord.js-commando');
const first = require('../../modules/first');
const user = require('../../modules/user');

module.exports = class FirstCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'first',
      aliases: ['first'],
      group: 'first',
      memberName: 'add',
      description: 'MAIS FIRST PUTAIN',
      details: 'FIRST BORDEL LA',
      examples: ['!first'],
      argsCount: 0,
    });
  }

  run(message) {

    if (first.hasBeenDone()) {
      return message.channel.send('First déjà fait..');
    }

    first.do(() => {
      user.didFirst(message.channel, message.author.id);
    });
  }
};
