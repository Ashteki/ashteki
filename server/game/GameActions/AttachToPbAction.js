const AttachAction = require('./AttachAction');
const { CardType } = require('../../constants');

class AttachToPbAction extends AttachAction {
    setup() {
        this.name = 'attachToPb';
        this.targetType = [CardType.Phoenixborn];
        this.effectMsg = 'attach {1} to {0}';
        this.effectArgs = () => {
            return this.upgrade;
        };
    }
}

module.exports = AttachToPbAction;
