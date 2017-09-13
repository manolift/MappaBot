const Commando = require('discord.js-commando');
const { user, message, emoji, first, number } = require('../../modules');

module.exports = class BankSaveCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'bank save',
      aliases: ['bank-save'],
      group: 'bank',
      memberName: 'save',
      description: 'Information banquaires',
      details: 'Rajouter de l\'argent dans ton compte avec interet par jour',
      examples: ['!bank-save 100'],
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
    const notEnoughMoney = await user.controlMoney(id, value);
    const allowed = await user.allowedTo('push', id, new Date())

    if (!number.isValid(value)) {
      message.addError({
        name: 'Banque',
        value: 'Ajoute un vrai montant',
      });
    }

    if (notEnoughMoney) {
      message.addError({
        name: 'Banque',
        value: 'Tu n\'as pas assez d\'argent pour déposer autant',
      });
    }

    if (!allowed) {
      message.addError({
        name: 'Banque',
        value: 'Tu ne peut envoyer qu\'une fois tout les 24h',
      })
    }

    if (!number.isValid(value) || notEnoughMoney || !allowed) {
      return message.send(msg);
    }

    await user.updateBank('push', id, value, ({ amount }) => {
      message.addValid({
        name: 'Banque',
        value: `Tu possèdes maintenant ${amount} ${emoji.kebab} dans ta banque`,
      });

      message.send(msg);
    });
  }
};
