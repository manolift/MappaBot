const Commando = require('discord.js-commando');
const user = require('../../modules/user');
const sweetMessages = require('../../modules/sweetMessages');

module.exports = class FirstCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'register',
      aliases: ['register'],
      group: 'infos',
      memberName: 'register',
      description: 'Register',
      details: 'S\'enregistrer pour pourvoir gagner des kebabs',
      examples: ['!register'],
      argsCount: 0,
    });
  }

  async run(message) {
    const registered = await user.register(message.author.id);

    if (registered) {
      sweetMessages.addError({
        name: 'Enregistrement',
        value: `<@${message.author.id}> à déjà été enregistré ...`,
      });
    } else {
      sweetMessages.addValid({
        name: 'Enregistrement',
        value: `<@${message.author.id}> à bien été enregistré !`,
      });
    }

    sweetMessages.send(message);
  }
};
