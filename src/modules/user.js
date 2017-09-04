const user = require('../db/models/user');

class User {
  constructor() {
    this.ratio = 5;
    this.defaultGive = 50;
    this.firstGive = this.defaultGive * this.ratio;
  }

  didFirst(channel, id) {
    user
      .findOneAndUpdate(
        { userId: id },
        { $inc: { kebabs: this.firstGive } },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      )
      .exec((err, _user) => {
        if (err) {
          return;
        }

        channel.send(`<@${_user.userId}> chope 250 :burrito:`);
      });
  }
}

module.exports = new User();
