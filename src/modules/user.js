const Client = require('../db/models/user');

class User {
  constructor() {
    this.ratio = 5;
    this.defaultGive = 50;
    this.firstGive = this.defaultGive * this.ratio;
  }

  get(userId) {
    return Client.findOne({ userId });
  }

  get users() {
    return Client.find({}).sort('-kebabs');
  }

  userQuery(userId, amount) {
    return Client.findOneAndUpdate(
      { userId },
      { $inc: { kebabs: amount } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }

  async register(userId) {
    try {
      const clientExists = await Client.findOne({ userId });

      if (!clientExists) {
        const client = new Client({ userId });
        client.save();
        return false;
      }

      return true;
    } catch (e) {
      return true;
    }
  }

  async giveDaily() {
    await Client.update({}, { $inc: { kebabs: this.defaultGive * 2 } }, { multi: true });
  }

  async didFirst(userId) {
    await this.userQuery(userId, this.firstGive);
  }

  async updateMoney(userId, amount) {
    await this.userQuery(userId, amount);
  }
}

module.exports = new User();
