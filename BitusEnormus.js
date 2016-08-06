var mongoose = require('mongoose'),
		db = mongoose.connection,
		Schema = mongoose.Schema,
		Discord = require('discord.io'),
		Commands = require('./Commands.json'),
		Utils = require('./Utils.json'),
		env = process.env.NODE_ENV || "development",
		bot = new Discord.Client({
		    autorun: true,
		    token: Utils.token
		});

//Change your IP Adress here!
const IP_ADRESS = Utils.ip;

/**
 * DATABASE SETUP
 */
if(env === "development"){
	mongoose.connect('mongodb://localhost/BitusEnormus');
}else{
	mongoose.connect('mongodb://'+IP_ADRESS+'/BitusEnormus');
}
var ladderboardSchema = new Schema({
		name: String,
		victories: Number
});
var ladderboardPlayer = mongoose.model('Ladder', ladderboardSchema);


// var antoine = new ladderboardPlayer({name: 'antoine', victories:54});
// var romain = new ladderboardPlayer({name: 'romain', victories:34});
// var remi = new ladderboardPlayer({name: 'remi', victories:34});
// var pierre = new ladderboardPlayer({name: 'pierre', victories:3});
// antoine.save();
// romain.save();
// remi.save();
// pierre.save();
// bot.on('ready', function(event) {});
// bot.on('presence', function(user, userID, status, gameName, event) {});
// Save those for later on!


var initRoll = false;
var playerOne = {};
var playerTwo = {};
bot.on('message', function(user, userID, channelID, message, event) {
	if(message === "!roll" && !initRoll){
		initRoll = true;
		playerOne = new Player(user, userID, true, undefined);

		bot.sendMessage({
			to:channelID,
			message: ':rocket:  '+user+' à démarré un duel! Utilisez "!roll me" pour l\'affronter  :rocket:'
		});
	}

	if(message === "!roll me" && initRoll && userID !== playerOne.id){
		playerTwo = new Player(user, userID, false, undefined);
		bot.sendMessage({
			to:channelID,
			message: `:rocket:  ${playerOne.name} :game_die: ${playerTwo.name}  :rocket:`,
			typing:true
		});

		/**
		 * We setTimeout for production environement because sometimes, the message
		 * upper appears after the dice has been rolled, doesn't make any sense
		 */
		setTimeout(function(){
			rollDice(channelID, playerOne.name, playerTwo.name);
			initRoll = false;
			playerOne = {};
			playerTwo = {};
		}, 1000 );
	}

	if(message === "!meme couteau"){
		sendFiles(channelID, ['./images/couteau.jpg']);
	}
	if(message === "!meme arthur"){
		sendFiles(channelID, ['./images/arthur.jpg']);
	}
	if(message === "!ladder"){
		ladderboardPlayer.find({})
			.sort('-victories')
			.exec(function(err, doc){
				if(!err){
					var ladder = doc;
					if(ladder.length){
						bot.sendMessage({
							to: channelID,
							message: ladder.map((player, index) => {
								return `**${setPlace(index+1)}** ${setMedal(index+1)} ${player.name} : ${player.victories} victoires !\n\n`;
							}).join('')
						});
					}else{
						bot.sendMessage({
							to: channelID,
							message: `:rocket:  Aucun joueur n'a encore joué  :rocket:`
						});
					}
				}
		});
	}
});

/**
 * setMedal - set the medal for current rank
 *
 * @param  {integer} rank
 * @return {string}
 */
function setMedal(rank){
	if(rank === 1) return '  :medal:';
	else return ':military_medal:';
}

/**
 * setPlace - set the current number for place
 *
 * @param  {integer} rank
 * @return {string}
 */
function setPlace(rank){
	if(rank === 1) return '1st';
	if(rank === 2) return '2nd';
	if(rank === 3) return '3rd';
	else return rank+'th';
}

/**
 * sayHelp - Display all commands
 *
 * @return {array}
 */
function sayHelp(){
	for(var i = 0; i < Commands.help.length; i++){
		return `:star: ${Commands.help[i].commandName} : ${Commands.help[i].explication}`;
	}
}


/**
 * rollDice - Make the dice roll!
 *
 * @param  {integer} channel
 * @param  {string} initName
 * @param  {string} adversaireName
 * @return {array}
 */
function rollDice(channelID, initName, adversaireName){
	playerOne.result = getRandomNumber();
	playerTwo.result = getRandomNumber();

	if(playerOne.result > playerTwo.result){
		rollQuery(playerOne.name);
		return bot.sendMessage({
			to: channelID,
			message: `:rocket:  ${initName} : **${playerOne.result}** | ${adversaireName} : **${playerTwo.result}**, **${initName} wonnered!**  :rocket:`
		});
	}else{
		rollQuery(playerTwo.name);
		return bot.sendMessage({
			to: channelID,
			message: `:rocket:  ${adversaireName} : **${playerTwo.result}** | ${initName} : **${playerOne.result}**, **${adversaireName} wonnered!**  :rocket:`
		});
	}
}


/**
 * getRandomNumber - Generate random number between 1 and 100
 *
 * @return {integer}
 */
function getRandomNumber(){
	return Math.floor(Math.random() * 100) + 1;
}


/**
 * rollQuery - Construct query for MongoDB
 *
 * @param  {string} Name of the player
 * @return {object}
 */
function rollQuery(playerName){
	var query = {name: playerName};
	var update = {$inc: {victories:1} };
	var options = {upsert: true, new: true, setDefaultsOnInsert: true};
	ladderboardPlayer.findOneAndUpdate(query, update, options, function(err, doc){
		if(!err) console.error('updated!');
	});
}


/**
 * Player - Player constructor
 *
 * @param  {string} playerName description
 * @param  {integer} playerID   description
 * @param  {boolean} hasInit    description
 * @param  {integer} rollResult description
 *
 */
function Player(playerName, playerID, hasInit, rollResult){
	this.hasInit = hasInit;
	this.name = playerName;
	this.id = playerID;
	this.result = rollResult;
}


/**
 * sendFiles - Send array of files
 *
 * @param  {integer} channelID description
 * @param  {array} fileArr   description
 * @param  {integer} interval  description
 * @return {array}
 */
function sendFiles(channelID, fileArr, interval) {
	var resArr = [],
			len = fileArr.length,
			callback = typeof(arguments[2]) === 'function' ? arguments[2] : arguments[3];
	if (typeof(interval) !== 'number') interval = 1000;

	function _sendFiles() {
		setTimeout(function() {
			if (fileArr[0]) {
				bot.uploadFile({
					to: channelID,
					file: fileArr.shift()
				}, function(err, res) {
					if (err) {
						resArr.push(err);
					} else {
						resArr.push(res);
					}
					if (resArr.length === len) if (typeof(callback) === 'function') callback(resArr);
				});
				_sendFiles();
			}
		}, interval);
	}
	_sendFiles();
}
