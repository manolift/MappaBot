const user = require('../db/models/user');

class User {
  constructor() {
    this.ratio = 5;
    this.defaultGive = 50;
    this.firstGive = this.defaultGive * this.ratio;
  }

  userQuery(userId, amount) {
    return user
      .findOneAndUpdate(
        { userId },
        { $inc: { kebabs: amount } },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
  }

  async didFirst(channel, userId) {
    const _user = await this.userQuery(userId, this.firstGive);
    channel.send(`<@${_user.userId}> gagne ${this.firstGive} :burrito:`);
  }

  async giveMoney(channel, userId, amount) {
    const _user = await this.userQuery(userId, amount);
    channel.send(`<@${_user.userId}> gagne ${amount} :burrito: ! <3`);
  }
}

module.exports = new User();
