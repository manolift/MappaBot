import path from 'path';

class Player {
  constructor(voiceChannel, file) {
    this.voiceChannel = voiceChannel;
    this.file = file;
  }

  playFile(volume = 1) {
    this.voiceChannel.join()
      .then((connection) => {
        const dispatcher = connection.playFile(path.join(__dirname, '..', 'sounds', this.file));
        dispatcher.setVolume(volume);
        dispatcher.on('end', () => {
          this.voiceChannel.leave();
        });
      })
      .catch(console.error);
  }
}

const AudioTracks = {
  '!aaaaa': 'ah.mp3',
  '!deukatorz': 'hugo.mp3',
  '!clebard': 'chien.mp3',
};

export { Player, AudioTracks };
