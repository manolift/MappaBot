const Commando = require('discord.js-commando');
const { user, message } = require('../../modules');

module.exports = class RegisterCommand extends Commando.Command {
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

  async run(msg) {
    const userId = msg.author.id;
    const registered = await user.register(userId);

    if (registered) {
      message.addError({
        name: 'Enregistrement',
        value: `<@${userId}> à déjà été enregistré ...`,
      });
    } else {
      message.addValid({
        name: 'Enregistrement',
        value: `<@${userId}> à bien été enregistré !`,
      });
    }

    message.send(msg);
  }
};
