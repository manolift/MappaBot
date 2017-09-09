const Commando = require('discord.js-commando');
const user = require('../../modules/user');
const sweetMessages = require('../../modules/sweetMessages');

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

  async run(message) {
    const client = await user.get(message.author.id);

    sweetMessages.addValid({
      name: 'Nombre de kebabs',
      value: `${client.kebabs} :burrito: !`,
    });

    sweetMessages.send(message);
  }
};
