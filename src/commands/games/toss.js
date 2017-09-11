const Commando = require('discord.js-commando');
const user = require('../../modules/user');
const sweetMessages = require('../../modules/sweetMessages');

module.exports = class FirstCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'toss',
      aliases: ['toss'],
      group: 'games',
      memberName: 'game',
      description: 'Pile ou face',
      details: 'Pile ou face',
      examples: ['!toss pile'],
      argsCount: 2,
      args: [
        {
          key: 'value',
          label: 'Pile ou Face',
          prompt: 'Choisi pile ou face',
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

  randomNumber() {
    return Math.random();
  }

  hasWon(val, choice) {
    const faceWon = val < 0.5 && choice === 'face';
    const pileWon = val > 0.5 && choice === 'pile';

    if (faceWon || pileWon) {
      return true;
    }

    return false;
  }

  async run(message, { value, kebabs }) {
    const normalize = str => str.toLowerCase().trim();
    const valid = normalize(value) === 'pile' || normalize(value) === 'face';
    const randomValue = this.randomNumber();
    const userId = message.author.id;
    const _user = await user.get(userId);

    if (!valid) {
      sweetMessages.addError({
        name: 'Invalide',
        value: 'Utilise sois `pile` ou `face`',
      });
    }

    if (kebabs < 0) {
      sweetMessages.addError({
        name: 'Kebabs',
        value: 'Tu dois mettre un nombre de kebab positif',
      });
    }

    /**
     * Cut the flow, otherwise max call size exception
     */
    if (!valid || kebabs < 0) {
      return sweetMessages.send(message);
    }

    /**
     * If not enough money, we cut the flow
     */
    if (kebabs > _user.kebabs) {
      sweetMessages.addError({
        name: 'Attention',
        value: `Tu n'as pas assez de :burrito:, il t'en manque ${kebabs - _user.kebabs}!`,
      });

      return sweetMessages.send(message);
    }

    if (this.hasWon(randomValue, value)) {
      user.updateMoney(userId, kebabs);
      sweetMessages.addValid({
        name: 'Gagné',
        value: `Tu as gagné ${kebabs} :burrito:`,
      });
    } else {
      user.updateMoney(userId, -kebabs);
      sweetMessages.addError({
        name: 'Perdu',
        value: `Tu as perdu ${kebabs} :burrito:`,
      });
    }

    return sweetMessages.send(message);
  }
};
