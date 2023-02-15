const Player = require("../player");
const NullPromptStrategy = require("./NullPromptStrategy");

class DummyPlayer extends Player {
    constructor(id, user, owner, game, clockdetails) {
        super(id, user, owner, game, clockdetails);
        this.firstFiveStrategy = new NullPromptStrategy(this, 'done');
        this.disStrategy = new NullPromptStrategy(this, 'no');
        this.behaviourRoll = 0;
        this.threatZone = []; // this is where 'drawn' aspects sit facedown in the battlefield before being 'flipped'
    }

    get isDummy() {
        return true;
    }

    get ffStrategy() {
        return this.firstFiveStrategy;
    }

    get discardStrategy() {
        return this.disStrategy
    }

    replenishAspects() {
        const threat = this.phoenixborn.threat;
        const cards = this.deck.slice(0, threat);
        cards.forEach(c => {
            this.moveCard(c, 'threatZone');
        })
    }

    getState(activePlayer) {
        const result = super.getState(activePlayer);
        result.cardPiles.threatZone = this.getSummaryForCardList(this.threatZone, activePlayer)

        return result;
    }
}

module.exports = DummyPlayer;