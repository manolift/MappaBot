const Commando = require('discord.js-commando');
const {
  user,
  message,
  emoji,
  number,
} = require('../../modules');

module.exports = class BankGetCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'bank take',
      aliases: ['bank-take', 'bank-get'],
      group: 'bank',
      memberName: 'take',
      description: 'Information banquaires',
      details: 'Prendre de l\'argent dans ton compte avec interet par jour',
      examples: ['!bank-take 100'],
      argsCount: 0,
      args: [
        {
          key: 'value',
          label: 'Kebabs',
          prompt: 'Nombre de kebabs',
          type: 'string',
        },
      ]
    });
  }

  async run(msg, { value }) {
    const { id } = msg.author;
    const client = await user.get(id);
    const enoughMoneyInBank = await user.controlMoneyInBank(id, value);
    const allowed = await user.allowedTo('get', id, new Date())

    if (!client.bank) {
      message.addError({
        name: 'Banque',
        value: 'Tu n\'as pas de banque',
      });
    }

    if (!number.isValid(value)) {
      message.addError({
        name: 'Banque',
        value: 'Ajoute un vrai montant',
      });
    }

    if (!enoughMoneyInBank && client.bank) {
      message.addError({
        name: 'Banque',
        value: 'Tu n\'as pas assez d\'argent sur ton compte',
      });
    }

    if (!allowed) {
      message.addError({
        name: 'Banque',
        value: 'Tu ne peut récuperer qu\'une fois tout les 24h',
      })
    }

    if (!number.isValid(value) || !enoughMoneyInBank || !allowed || !client.bank) {
      return message.send(msg);
    }

    await user.updateBank('get', id, -value, ({ amount }) => {
      message.addValid({
        name: 'Banque',
        value: `Tu possèdes maintenant ${amount} ${emoji.kebab} dans ta banque`,
      });

      message.send(msg);
    });
  }
};
