class NumberValidation {
  _validateStack(str) {
    const tmp = str.split('-');
    const min = parseInt(tmp[0], 10);
    const max = parseInt(tmp[1], 10);

    if (tmp.length !== 2 || min > max) {
      return false;
    }

    if (this.isValid(min) && this.isValid(max) && max <= 100) {
      return true;
    }

    return false;
  }

  isValid(val) {
    const value = parseInt(val, 10);
    return value >= 0 && Number.isFinite(value) && (typeof value === 'number');
  }

  isValidStack(str) {
    if (this._validateStack(str)) {
      return true;
    }

    return false;
  }
}

module.exports = new NumberValidation();
