const Client = require('../db/models/user');
const Bank = require('../db/models/bank');
const moment = require('moment');

class User {
  constructor() {
    this.ratio = 3;
    this.defaultGive = 500;
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

  async updateBank(method, userId, amount, cb) {
    const client = await Client.findOne({ userId }).populate('bank');

    if (!client.bank) {
      const newBank = new Bank({
        belongsTo: client._id,
        lastSet: new Date(),
      });

      return newBank.save(async (err) => {
        if (err) {
          return console.log(err);
        }

        await Client.findByIdAndUpdate(client.id, { bank: newBank._id, $inc: { kebabs: -amount }});
        const updatedBank = await Bank.findByIdAndUpdate(newBank.id, { $inc: { amount }}, { new: true });

        return cb(updatedBank);
      });
    }

    let query;
    if (method === 'get') {
      query = {
        $inc: { amount },
        lastGet: new Date()
      }
    } else {
      query = {
        $inc: { amount },
        lastSet: new Date()
      }
    }

    await Client.findByIdAndUpdate(client.id, { $inc: { kebabs: -amount }});
    const updatedBank = await Bank.findByIdAndUpdate(client.bank.id, query, { new: true });

    return cb(updatedBank);
  }

  async allowedTo(method, userId, date) {
    const user = await this.get(userId).populate('bank');

    if (!user.bank) {
      return true;
    }

    if (method === 'get' && !user.bank.lastGet) {
      return true;
    }

    const dayAfter = moment(method === 'push' ? user.bank.lastSet : user.bank.lastGet).add(1, 'day');
    const date_ = moment(date);

    return dayAfter.isBefore(date_);
  }

  async controlMoney(userId, amount) {
    const client = await Client.findOne({ userId });

    if (client.kebabs >= amount) {
      return false;
    }

    return true;
  }

  async controlMoneyInBank(userId, amount) {
    try {
      const client = await Client.findOne({ userId }).populate('bank');

      if (amount > client.bank.amount) {
        return false;
      }

      return true;
    } catch (e) {
      return false;
    }
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

  async giveTo(initiator, userId, amount) {
    const client = await Client.findOne({ userId: initiator });

    if (client.kebabs > amount) {
      await this.userQuery(userId, +amount);
      await this.userQuery(initiator, -amount);

      // Everything went well
      return true;
    }

    // Not enough money
    return false;
  }
}

module.exports = new User();
