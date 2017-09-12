class NumberValidation {
  _validateStack(str) {
    const tmp = str.split('-');
    const [min, max] = tmp;

    if (tmp.length !== 2) {
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
