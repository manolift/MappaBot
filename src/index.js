/**
 * INV LINK: https://discordapp.com/api/oauth2/authorize?client_id=336909405981376524&scope=bot&permissions=0
 */
import Discord from 'discord.js';
import * as env from 'dotenv';
import imageLibrary from '../mappa.json';
import { Player, AudioTracks } from './player';

// Config
const client = new Discord.Client();
env.config();

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', (message) => {
  const memberRoles = message.member.roles;
  if (memberRoles.exists('name', 'Random')) {
    return message.channel.send(':robot: Désolé mais tu n\'est pas autorisé à utiliser le bot :robot:');
  }

  if (message.content === '!mappa') {
    const len = imageLibrary.album.length;
    const randomIndex = Math.floor(Math.random() * (len - 0)) + 0;

    message.channel.send(imageLibrary.album[randomIndex].link);
  }

  if (AudioTracks[message.content]) {
    const { voiceChannel } = message.member;
    new Player(voiceChannel, AudioTracks[message.content]).playFile();
  }
});

client.login(process.env.DISCORD_TOKEN);
