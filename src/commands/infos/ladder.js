const Commando = require('discord.js-commando');
const user = require('../../modules/user');
const sweetMessages = require('../../modules/sweetMessages');

module.exports = class FirstCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'ladder',
      aliases: ['ladder', 'ladderboard'],
      group: 'infos',
      memberName: 'info',
      description: 'Ladderboard',
      details: 'Classement des kebabs Mappa',
      examples: ['!ladder', '!ladderboard'],
      argsCount: 0,
    });
  }

  async run(message) {
    const users = await user.users;

    sweetMessages.addValid({
      name: 'Ladderboard',
      value: users.map((_user, i) => {
        const profile = message.guild.members.find('id', _user.userId).user.username;

        return `${i + 1} - ${profile} : ${_user.kebabs} :burrito:`;
      }).join('\n'),
    });

    sweetMessages.send(message);
  }
};
