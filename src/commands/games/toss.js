const Commando = require('discord.js-commando');
const { user, message, emoji } = require('../../modules');

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

  async run(msg, { value, kebabs }) {
    const normalize = str => str.toLowerCase().trim();
    const valid = normalize(value) === 'pile' || normalize(value) === 'face';
    const randomValue = this.randomNumber();
    const userId = msg.author.id;
    const _user = await user.get(userId);

    if (!valid) {
      message.addError({
        name: 'Invalide',
        value: 'Utilise sois `pile` ou `face`',
      });
    }

    if (kebabs < 0) {
      message.addError({
        name: 'Kebabs',
        value: `Tu dois mettre un nombre de ${emoji.kebab} positif`,
      });
    }

    /**
     * Cut the flow, otherwise max call size exception
     */
    if (!valid || kebabs < 0) {
      return message.send(msg);
    }

    /**
     * If not enough money, we cut the flow
     */
    if (kebabs > _user.kebabs) {
      message.addError({
        name: 'Attention',
        value: `Tu n'as pas assez de ${emoji.kebab}, il t'en manque ${kebabs - _user.kebabs}!`,
      });

      return message.send(msg);
    }

    if (this.hasWon(randomValue, value)) {
      user.updateMoney(userId, kebabs);
      message.addValid({
        name: 'Gagné',
        value: `Tu as gagné ${kebabs} ${emoji.kebab}`,
      });
    } else {
      user.updateMoney(userId, -kebabs);
      message.addError({
        name: 'Perdu',
        value: `Tu as perdu ${kebabs} ${emoji.kebab}`,
      });
    }

    return message.send(msg);
  }
};
