const Commando = require('discord.js-commando');
const { user, emoji, number, message } = require('../../modules');

module.exports = class RollCommands extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'roll',
      aliases: ['roll'],
      group: 'games',
      memberName: 'roll',
      description: 'Roll',
      details: 'Roll, plus la fourchette est petite, plus tu gagne de fric',
      examples: ['!roll 100 0-50'],
      argsCount: 2,
      args: [
        {
          key: 'value',
          label: 'Kebabs',
          prompt: 'Nombre de kebabs',
          type: 'string',
        },
        {
          key: 'stack',
          label: 'fourchette',
          prompt: 'Ta fourchette ([min]-[max])',
          type: 'string',
        },
      ],
    });

    this.min = undefined;
    this.max = undefined;
  }

  get randomNumber() {
    return Math.floor(Math.random() * (100 - (0 + 1))) + 0;
  }

  hasWon(random) {
    return random <= this.max && random >= this.min;
  }

  getAmountByThreshold(value) {
    if (this.min === this.max) {
      /**
       * Its a 15* coefficient to prevent 1 value spam
       * For !roll 1 50-50 (aiming to spam for 50)
       * It gives you 150 kebabs
       * Same command, but 100 kebabs,
       * it gives you 15000 kebabs
       */
      return Math.floor(15000 * (1 / 100) * value);
    }
    return Math.floor(((1 / (this.max - this.min)) * 100) * value);
  }

  async run(msg, { value, stack }) {
    // Safe to use since we control in validStack method
    const [min, max] = stack.split('-');
    this.min = min;
    this.max = max;

    if (number.isValid(value) && number.isValidStack(stack)) {
      const randomNumber = 67;
      if (this.hasWon(randomNumber)) {
        const amountWon = this.getAmountByThreshold(value);
        await user.updateMoney(msg.author.id, amountWon - value);

        message.addValid({
          name: `Gagné! (${randomNumber})`,
          value: `Tu as gagné ${amountWon} ${emoji.kebab} !`,
        });
      } else {
        await user.updateMoney(msg.author.id, -value);

        message.addError({
          name: `Perdu... (${randomNumber})`,
          value: `Tu as perdu ${value} ${emoji.kebab} !`,
        });
      }
    } else {
      message.addError({
        name: 'Mauvais format de commande',
        value: '!roll <kebabs> [min]-[max]',
      });
    }

    message.send(msg);
  }
};
