const AttachAction = require('./AttachAction');
const { CardType, PhoenixbornTypes } = require('../../constants');

class AttachToPbAction extends AttachAction {
    setup() {
        this.name = 'attachToPb';
        this.targetType = PhoenixbornTypes;
        this.effectMsg = 'attach {1} to {0}';
        this.effectArgs = () => {
            return this.upgrade;
        };
    }
}

module.exports = AttachToPbAction;
