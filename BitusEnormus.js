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
		}),
		Cleverbot = require('cleverbot-node');

cleverbot = new Cleverbot();

var initRoll = false;
var hasRolled = false;
var isFirst = false;
var playerOne = {};
var playerTwo = {};

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
	victories: {type: Number, default: 0},
	bank: {type: Number, default: 0},
	date: Date
});
var firstSchema = new Schema({
  name: String,
	timesHasBeenFirst: Number
});
var ladderboardPlayer = mongoose.model('Ladder', ladderboardSchema);
var Firster = mongoose.model('First', firstSchema);

// bot.on('ready', function(event) {});
// bot.on('presence', function(user, userID, status, gameName, event) {});
// Save those for later on!

bot.on('ready', function(event){
	bot.setPresence({
		game: "coding"
	});
});

bot.on('any', function(event){
	if(new Date().getHours() >= 0 && new Date().getHours() < 12){
		isFirst = false;
	}else{
		console.log('waiting for 0h00');
	}
});


bot.on('message', function(user, userID, channelID, message, event) {
	if(message === "!roll" && !initRoll){
		initRoll = true;
		playerOne = new Player(user, userID, true, undefined);

		bot.sendMessage({
			to:channelID,
			message: ':rocket:  '+user+' à démarré un duel! Utilisez "!roll me" pour l\'affronter  :rocket:'
		});
	}

	if(message === "!roll me" && initRoll && userID !== playerOne.id && !hasRolled){
		//Prevent from spamming !roll me that cause to add 'null' in database...
		hasRolled = true;
		playerTwo = new Player(user, userID, false, undefined);
		bot.sendMessage({
			to:channelID,
			message: `:rocket:  ${playerOne.name} :game_die: ${playerTwo.name}  :rocket:`
		});

		/**
		 * We setTimeout for production environement because sometimes, the message
		 * upper appears after the dice has been rolled, doesn't make any sense
		 */
		setTimeout(function(){
			rollDice(channelID, playerOne.name, playerTwo.name);
			initRoll = false;
			hasRolled = false;
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
								return `**${setPlace(index+1)}** ${setMedal(index+1)} ${player.name} : ${player.victories} victoires et possède ${player.bank} kebabs!\n\n`;
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
	if(message === "!ladder first"){
		Firster.find({})
			.sort('-timesHasBeenFirst')
			.exec(function(err, doc){
				if(!err){
					var firstLadder = doc;
					if(firstLadder.length){
						bot.sendMessage({
							to: channelID,
							message: firstLadder.map((person, index) => {
									return `**${setPlace(index+1)}** ${setMedal(index+1)} ${person.name} : ${person.timesHasBeenFirst} first!\n\n`;
								}).join('')
							});
						}
					}else{
					  bot.sendMessage({
							to: channelID,
							message: `:rocket:  Aucun joueur n'a encore firsté  :rocket:`
						});
					}
			});
	}
	if(message === "!help"){
		bot.sendMessage({
			to:channelID,
			message: Commands.help.map((command) => {
				return `:arrow_right: ${command.commandName} : ${command.explication} \n\n`;
			}).join('')
		});
	}

	if(message.match(/^(<@198532347765850112>)/g)){
		var msgArr = message.split(' ');
		msgArr.shift();
		Cleverbot.prepare(function(){
			cleverbot.write(msgArr.join(' '), function(res){
				bot.sendMessage({
					to:channelID,
					message: `:robot:  <@${userID}> ${res.message}  :robot:`
				});
			});
		});
	}

	if(message === "!first" && !isFirst){
		firstQuery(user);
		setMoney(user, 5000);
		bot.sendMessage({
			to:channelID,
			message: `${user} à eu le first a+ les noobix`
		});
		isFirst = true;
	}else if(message === "!first" && isFirst){
		bot.sendMessage({
			to:channelID,
			message: `Trop tard grosse :poop:`
		});
	}

	if(message === "!argentstp"){
		ladderboardPlayer.find({name: user})
			.exec(function(err, doc){
				if(!err){
					if(!doc.length){
						getTodayMoney(user, channelID);
					}else{
						var date = doc[0].date;
						console.log('date in doc '+date);
						var dateAfterOneDay = new Date(+doc[0].date + 1*24*60*60*1000);
						console.log('date after 1 day '+dateAfterOneDay);
						var dateNow = new Date();
						console.log('date maintenant '+dateNow);

						if(dateNow > dateAfterOneDay){
							getTodayMoney(user, channelID);
						}
						else if(dateNow > date && dateNow < dateAfterOneDay){
							bot.sendMessage({
								to:channelID,
								message: `Impossible, réessaye demain à ${dateAfterOneDay.getHours()}h${dateAfterOneDay.getMinutes()}m${dateAfterOneDay.getSeconds()}s`
							});
						}
					}
				}
			});
	}

	if(message==="issou"){
		sendFiles(channelID, ['./images/issou.jpg']);
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
		setMoney(playerOne.name, 100);
		setMoney(playerTwo.name, -50);
		return bot.sendMessage({
			to: channelID,
			message: `:rocket:  ${initName} : **${playerOne.result}** | ${adversaireName} : **${playerTwo.result}**, **${initName} wonnered! +100 kebabs**  :rocket:`
		});
	}else{
		rollQuery(playerTwo.name);
		setMoney(playerTwo.name, 100);
		setMoney(playerOne.name, -50);
		return bot.sendMessage({
			to: channelID,
			message: `:rocket:  ${adversaireName} : **${playerTwo.result}** | ${initName} : **${playerOne.result}**, **${adversaireName} wonnered! +100 kebabs**  :rocket:`
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
	var update = {$inc: {'victories':1} };
	var options = {upsert: true, new: true, setDefaultsOnInsert: true};
	ladderboardPlayer.findOneAndUpdate(query, update, options, function(err, doc){
		if(!err) console.error('updated!');
	});
}

function firstQuery(firsterName){
	var query = {name: firsterName};
	var update = {$inc: {'timesHasBeenFirst':1} };
	var options = {upsert: true, new: true, setDefaultsOnInsert: true};
	Firster.findOneAndUpdate(query, update, options, function(err, doc){
		if(!err) console.error('updated!');
	});
}

function setMoney(playerName, amount){
	var query = {name: playerName};
	var update = {$inc: {'bank': amount} };
	var options = {upsert: true, new: true, setDefaultsOnInsert: true};
	ladderboardPlayer.findOneAndUpdate(query, update, options, function(err, doc){
		if(!err) console.error('updated!');
	});
}
function getTodayMoney(user, channelID){
	var query = {name: user};
	var update = {$inc: {'bank':500} , $set: {date: new Date()}};
	var options = {upsert: true, new: true, setDefaultsOnInsert: true};
	ladderboardPlayer.findOneAndUpdate(query, update, options, function(err, doc){
		if(err) console.log(err);
		if(!err) console.error('Gave 500 kebabs to '+user);
	});

	bot.sendMessage({
		to:channelID,
		message: `+500 kebabs pour ${user}`
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
