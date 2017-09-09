const Commando = require('discord.js-commando');
const first = require('../../modules/first');
const user = require('../../modules/user');
const sweetMessages = require('../../modules/sweetMessages');

module.exports = class FirstCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'first',
      aliases: ['first'],
      group: 'first',
      memberName: 'add',
      description: 'MAIS FIRST PUTAIN',
      details: 'FIRST BORDEL LA',
      examples: ['!first'],
      argsCount: 0,
    });
  }

  run(message) {
    if (first.hasBeenDone()) {
      sweetMessages.addError({
        name: 'Trop tard',
        value: 'Le first à déjà été pris :weary:',
      });

      return sweetMessages.send(message);
    }

    return first.do(() => {
      user.didFirst(message.author.id);

      sweetMessages.addValid({
        name: 'FIRST',
        value: `Bien joué! Tu gagne ${user.firstGive} :burrito: !`,
      });

      return sweetMessages.send(message);
    });
  }
};
