const Commando = require('discord.js-commando');
const { user, emoji, number, message } = require('../../modules');

module.exports = class FirstCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'roll',
      aliases: ['roll'],
      group: 'games',
      memberName: 'roll',
      description: 'Roll',
      details: 'Roll, plus la fourchette est petite, plus tu gagne de fric',
      examples: ['!roll 100 0-50'],
      argsCount: 2,
      args: [
        {
          key: 'value',
          label: 'Kebabs',
          prompt: 'Nombre de kebabs',
          type: 'string',
        },
        {
          key: 'stack',
          label: 'fourchette',
          prompt: 'Ta fourchette ([min]-[max])',
          type: 'string',
        },
      ],
    });
  }

  run(msg, { value, stack }) {
    if (number.isValid(value) && number.isValidStack(stack)) {
      message.addValid({
        name: 'Valid stack',
        value: 'stack been valid',
      });
    }

    message.send();
  }
};
