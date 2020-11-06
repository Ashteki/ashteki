const EventEmitter = require('events');
const logger = require('../log.js');

class MessageService extends EventEmitter {
    constructor(db) {
        super();
        this.messages = db.get('messages');
    }

    async addMessage(message) {
        return this.messages.insert(message).catch((err) => {
            logger.error('Unable to insert message', err);
            throw new Error('Unable to insert message');
        });
    }

    async getLastMessagesForUser() {
        return this.messages.find({}, { limit: 150, sort: { time: -1 } });
    }

    async removeMessage(messageId, user) {
        await this.messages.remove({ _id: messageId }).catch((err) => {
            logger.error('Failed to remove message', err);
            throw new Error('Failed to remove message');
        });

        this.emit('messageDeleted', messageId, user);
    }

    async getMotdMessage() {
        return undefined;
    }
}

module.exports = MessageService;
