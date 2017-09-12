const Commando = require('discord.js-commando');
const { user, message, emoji } = require('../../modules');

module.exports = class FirstCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'kebab',
      aliases: ['kebab'],
      group: 'infos',
      memberName: 'add',
      description: 'Mes kebabs',
      details: 'Savoir son nombre de kebab',
      examples: ['!kebab'],
      argsCount: 0,
    });
  }

  async run(msg) {
    const client = await user.get(msg.author.id);

    message.addValid({
      name: 'Nombre de kebabs',
      value: `${client.kebabs} ${emoji.kebab} !`,
    });

    message.send(msg);
  }
};
