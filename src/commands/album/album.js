const Commando = require('discord.js-commando');
const Photos = require('../../db/models/album');
const { message } = require('../../modules');

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

    this.random = null;
  }

  getPhotosLength() {
    return Photos.count();
  }

  async getRandomPhoto() {
    return Photos.findOne().skip(this.random);
  }

  async run(msg) {
    const len = await this.getPhotosLength();
    this.random = Math.floor(Math.random() * len);
    const photo = await this.getRandomPhoto();

    message.sendImage(msg, photo.link);
  }
};
