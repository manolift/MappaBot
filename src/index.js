/**
 * INV LINK: https://discordapp.com/api/oauth2/authorize?client_id=336909405981376524&scope=bot&permissions=0
 */
const Commando = require('discord.js-commando');
const sqlite = require('sqlite');
const env = require('dotenv');
const path = require('path');

env.config();
const log = arg => console.log(arg);
const client = new Commando.Client({
  owner: process.env.OWNER_ID,
});

client.on('ready', () => log('Bot is ready fdp!'));

client.setProvider(
  sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);

client.registry
  .registerGroups([
    ['sounds', 'Soundbox'],
    ['album', 'Album Mappa'],
    ['add', 'Ajoute une musique'],
  ])
  .registerDefaults()
  .registerCommandsIn(path.join(__dirname, 'commands'));

client.login(process.env.DISCORD_TOKEN);
