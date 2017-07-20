const Commando = require('discord.js-commando');
const path = require('path');
const fs = require('fs');

module.exports = class PlayCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'sound',
      aliases: ['play', 'sound'],
      group: 'sounds',
      memberName: 'add',
      description: 'Joue un son',
      details: 'Joue un son',
      examples: ['!play hugo', '!play deukatorz'],
      argsCount: 1,
      args: [
        {
          key: 'soundKey',
          label: 'Son',
          prompt: 'Joue un son en tapant !play [son]',
          type: 'string',
        },
      ],
    });
  }

  async run(message, args) {
    const { voiceChannel } = message.member;
    const { soundKey } = args;

    // Commands are based on striped filenames minus mp3 extension
    const availableCommands = fs.readdirSync(path.join(__dirname, 'sounds')).map(sound => sound.slice(0, -4));

    /**
     * @description If not in a voice channel
     */
    if (!voiceChannel) {
      return await message.reply('tu dois rejoindre un channel :triumph:');
    }

    /**
     * @description If desired sound does not exist in folder
     */
    if (availableCommands.indexOf(soundKey) === -1) {
      return await message.reply(
      `ce son n'existe pas, mais voici ceux disponibles :
        ${availableCommands.map(command => `\n**${command}**`)}
      `);
    }

    /**
     * @description Join voice channel to play selected file
     */
    voiceChannel.join()
      .then((connection) => {
        const dispatcher = connection.playFile(path.join(__dirname, 'sounds', `${soundKey}.mp3`));
        dispatcher.setVolume(0.5);
        dispatcher.on('end', () => {
          voiceChannel.leave();
        });
      })
      .catch(console.error);
  }
};
