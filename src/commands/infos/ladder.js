const Commando = require('discord.js-commando');
const { user, message, emoji } = require('../../modules');

module.exports = class LadderCommand extends Commando.Command {
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

  async run(msg) {
    const users = await user.users;

    message.addValid({
      name: 'Ladderboard',
      value: users.map((_user, i) => {
        const profile = msg.guild.members.find('id', _user.userId).user.username;

        return `${i + 1} - ${profile} : ${_user.kebabs} ${emoji.kebab}`;
      }).join('\n'),
    });

    message.send(msg);
  }
};
