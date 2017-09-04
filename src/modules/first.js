const moment = require('moment');

class First {
  constructor() {
    this.first = false;
    this.timer = undefined;
  }

  do(callback) {
    const tomorrowMidnight = moment().add(1, 'day').startOf('day');
    const tstampLeft = tomorrowMidnight.diff(moment());

    this.first = true;
    this.timer = setTimeout(() => {
      this.first = false;
    }, tstampLeft);

    callback();
  }

  hasBeenDone() {
    return this.first === true;
  }
}

module.exports = new First();
