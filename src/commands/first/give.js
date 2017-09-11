const Commando = require('discord.js-commando');
const user = require('../../modules/user');
const sweetMessages = require('../../modules/sweetMessages');
const Emoji = require('../../modules/emoji');

module.exports = class FirstCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'give',
      aliases: ['give'],
      group: 'infos',
      memberName: 'give',
      description: 'Give',
      details: "Donner des kebabs a quelqu'un",
      examples: ['!give @Antoine 10'],
      argsCount: 2,
      args: [
        {
          key: 'userId',
          label: 'Donner à',
          prompt: 'Donner à qui?',
          type: 'string',
        },
        {
          key: 'kebabs',
          label: 'Kebabs',
          prompt: 'Nombre de kebabs',
          type: 'string',
        },
      ],
    });
  }

  async run(message, args) {
    const id = args.userId.replace(/<@/, '').replace('!', '');
    const userId = id.replace(/>/, '');
    const isValidAmount = args.kebabs > 0;
    const notValidUser = (message_, uid) => !message_.guild.members.exists('id', uid);

    if (!isValidAmount) {
      sweetMessages.addError({
        name: 'Donation',
        value: `Ton nombre de ${Emoji.kebab} est invalide`,
      });
    }

    if (message.author.id === userId) {
      sweetMessages.addError({
        name: 'Donation',
        value: 'Tu ne peut pas te donner à toi même...',
      });
    }

    if (notValidUser(message, userId)) {
      sweetMessages.addError({
        name: 'Donation',
        value: 'Cet utilisateur n\'existe pas',
      });
    }

    if (!isValidAmount || message.author.id === userId || notValidUser(message, userId)) {
      return sweetMessages.send(message);
    }

    const hasGiven = await user.giveTo(message.author.id, userId, args.kebabs);

    if (!hasGiven) {
      sweetMessages.addError({
        name: 'Donation',
        value: `Tu n'as pas assez de ${Emoji.kebab}`,
      });
    } else {
      sweetMessages.addValid({
        name: 'Donation',
        value: `Tu as donné ${args.kebabs} ${Emoji.kebab}`,
      });
    }

    return sweetMessages.send(message);
  }
};
