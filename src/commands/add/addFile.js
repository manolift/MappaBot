const Commando = require('discord.js-commando');
const path = require('path');
const fs = require('fs');
const request = require('request');

module.exports = class AddFileCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'add',
      aliases: ['add'],
      group: 'add',
      memberName: 'add',
      description: 'Ajouter une musique',
      details: 'Ajoute une musique a la collection',
      examples: ['!add'],
      argsCount: 0,
    });
  }

  static hasMP3Extension(file) {
    const array = file.split('.');
    return array[array.length - 1] === 'mp3';
  }

  async run(message, args) {
    if (!message.attachments.first()) {
      message.channel.send(':rotating_light: Tu n\'as pas envoyé de fichier :rotating_light:');
    }

    const { filename, url } = message.attachments.first();

    if (this.hasMP3Extension(filename)) {
      return request
        .get(url)
        .on('error', () => {
          message.channel.send(':rotating_light: Erreur dans le téléchargement :rotating_light:');
        })
        .pipe(fs.createWriteStream(path.join(__dirname, '..', 'sounds', 'sounds', filename)));
    }

    message.channel.send(':rotating_light: Envoie un MP3 :rotating_light:');
  }
};
