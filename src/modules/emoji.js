class Emoji {
  constructor() {
    this.kebabId = undefined;
  }

  setKebab(id) {
    this.kebabId = id;
  }

  get kebab() {
    return `<:kebab:${this.kebabId}>`;
  }
}

module.exports = new Emoji();
