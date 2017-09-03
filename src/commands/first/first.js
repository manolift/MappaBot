const Commando = require('discord.js-commando');

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
    //TODO: write module to set global isfirst module
    message.channel.send('yohooo');
  }
};
