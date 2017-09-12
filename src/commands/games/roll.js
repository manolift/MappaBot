const Commando = require('discord.js-commando');
const { user, emoji, number, message } = require('../../modules');

module.exports = class FirstCommand extends Commando.Command {
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
       * If its !roll 100 0-1, we win 10K, so if its exact
       * (aka 0-0), we return 15K kebabs
       */
      return 15000;
    }

    return Math.floor((((this.min + 1) / this.max) * 100) * value);
  }

  async run(msg, { value, stack }) {
    // Safe to use since we control in validStack method
    const [min, max] = stack.split('-');
    this.min = min;
    this.max = max;

    if (number.isValid(value) && number.isValidStack(stack)) {
      if (this.hasWon(this.randomNumber)) {
        const amountWon = this.getAmountByThreshold(value);
        await user.updateMoney(msg.author.id, amountWon - value);

        message.addValid({
          name: 'Gagné!',
          value: `Tu as gagné ${amountWon} ${emoji.kebab} !`,
        });
      } else {
        await user.updateMoney(msg.author.id, -value);

        message.addError({
          name: 'Perdu...',
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
