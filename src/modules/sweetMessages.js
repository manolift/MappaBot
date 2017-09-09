class SweetMessages {
  constructor() {
    this.queue = {
      errors: [],
      valid: [],
    };
  }

  addError({ name, value }) {
    this.queue.errors = [...this.queue.errors, { name, value }];
  }

  addValid({ name, value }) {
    this.queue.valid = [...this.queue.valid, { name, value }];
  }

  clearQueue() {
    this.queue = {
      errors: [],
      valid: [],
    };
  }

  shouldThrow() {
    return this.queue.errors.length > 0;
  }

  message(message, fields, isError) {
    message.channel.send({
      embed: {
        color: isError ? 16711680 : 65280,
        author: {
          name: message.author.username,
          icon_url: message.author.avatarURL,
        },
        title: '',
        fields,
        footer: {
          icon_url: message.client.user.avatarURL,
          text: `- ${message.client.user.username}`,
        },
      },
    });
  }

  sendImage(message, link) {
    return message.channel.send({
      embed: {
        color: 65280,
        author: {
          name: message.client.user.username,
          icon_url: message.client.user.avatarURL,
        },
        title: '',
        fields: [],
        image: {
          url: link,
        },
      },
    });
  }

  send(message) {
    if (this.shouldThrow()) {
      this.message(message, this.queue.errors, true);
      return this.clearQueue();
    }

    this.message(message, this.queue.valid, false);
    return this.clearQueue();
  }
}

module.exports = new SweetMessages();
