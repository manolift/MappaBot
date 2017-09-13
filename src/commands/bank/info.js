const Commando = require('discord.js-commando');
const { user, message, emoji, first } = require('../../modules');

module.exports = class BankInfoCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'bank info',
      aliases: ['bank'],
      group: 'bank',
      memberName: 'info',
      description: 'Information banquaires',
      details: 'Toutes les infos de ta banque Mappa',
      examples: ['!bank', '!bank info'],
      argsCount: 0,
    });
  }

  async run(msg) {
    const { id } = msg.author;
    const client = await user.get(id).populate('bank');

    if (!client.bank) {
      message.addError({
        name: 'Banque',
        value: 'Tu n\'as pas de banque ...',
      });
    } else {
      message.addValid({
        name: 'Banque',
        value: `Tu possèdes ${client.bank.amount} ${emoji.kebab} dans ta banque`,
      });
    }

    message.send(msg);
  }
};
