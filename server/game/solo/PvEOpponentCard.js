const Card = require('../Card');

class PvEOpponentCard extends Card {
    constructor(owner, cardData) {
        super(owner, cardData);
        this.level = 'S';
        this.stage = 1;
        this.printedThreat = cardData.threat || 0;
    }

    get heroic() {
        return this.level === 'H';
    }

    get setup() {
        return [];
    }

    get threat() {
        return this.getThreat() + (this.tokens.threat || 0);
    }

    getThreat() {
        return this.printedThreat;
    }

    hasModifiedThreat() {
        return this.tokens.threat > 0;
    }

    getFlags() {
        const flags = super.getFlags();
        if (this.game.isSurvival && this.hasModifiedThreat()) {
            flags.threat = this.threat;
        }
        return flags;
    }

    setupCardAbilities(ability) {

    }
}

module.exports = PvEOpponentCard;
