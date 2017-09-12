const Commando = require('discord.js-commando');
const { user, message, emoji } = require('../../modules');

module.exports = class GiveCommand extends Commando.Command {
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

  async run(msg, args) {
    const id = args.userId.replace(/<@/, '').replace('!', '');
    const userId = id.replace(/>/, '');
    const isValidAmount = args.kebabs > 0;
    const notValidUser = (message_, uid) => !message_.guild.members.exists('id', uid);

    if (!isValidAmount) {
      message.addError({
        name: 'Donation',
        value: `Ton nombre de ${emoji.kebab} est invalide`,
      });
    }

    if (msg.author.id === userId) {
      message.addError({
        name: 'Donation',
        value: 'Tu ne peut pas te donner à toi même...',
      });
    }

    if (notValidUser(msg, userId)) {
      message.addError({
        name: 'Donation',
        value: 'Cet utilisateur n\'existe pas',
      });
    }

    if (!isValidAmount || msg.author.id === userId || notValidUser(msg, userId)) {
      return message.send(msg);
    }

    const hasGiven = await user.giveTo(msg.author.id, userId, args.kebabs);

    if (!hasGiven) {
      message.addError({
        name: 'Donation',
        value: `Tu n'as pas assez de ${emoji.kebab}`,
      });
    } else {
      message.addValid({
        name: 'Donation',
        value: `Tu as donné ${args.kebabs} ${emoji.kebab}`,
      });
    }

    return message.send(msg);
  }
};
