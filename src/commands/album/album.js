const Commando = require('discord.js-commando');
const photos = require('../../../mappa.json').album;

module.exports = class AlbumCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'album',
      aliases: ['mappa', 'album'],
      group: 'album',
      memberName: 'add',
      description: 'Affiche une image au hasard de l\'album',
      details: 'Affiche une image au hasard de l\'album',
      examples: ['!mappa'],
      argsCount: 0,
    });
  }

  async run(message, args) {
    const len = photos.length;
    const random = Math.floor(Math.random() * (len - 0)) + 0;

    message.channel.send('', { file: photos[random].link });
  }
};
