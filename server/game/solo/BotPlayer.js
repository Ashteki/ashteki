const BotDicePromptStrategy = require('./BotDicePromptStrategy');
const BotFFStrategy = require('./BotFFStrategy');
const BotTargetCardStrategy = require('./BotTargetCardStrategy');
const DummyPlayer = require('./DummyPlayer');

class BotPlayer extends DummyPlayer {
    constructor(id, user, owner, game, clockdetails) {
        super(id, user, owner, game, clockdetails);
        this.firstFiveStrategy = new BotFFStrategy(this);
        this.dicePromptStrategy = new BotDicePromptStrategy(this);
        this.targetCardStrategy = new BotTargetCardStrategy(this);
    }

    get confirmOneClick() {
        return false;
    }

    get isBot() {
        return true;
    }

    getAllActions(options = {}) {
        const ignoredRequirements = options.ignoreDiceCost ? ['diceCost'] : [];
        if (options.ignoreActionCost) {
            ignoredRequirements.push('actionCost');
        }
        const usableCards = [...this.hand, ...this.spellboard, ...this.unitsInPlay];
        const result = usableCards.reduce(
            (agg, card) => agg.concat(card.getLegalActions(this, ignoredRequirements)),
            []
        );
        return result;
    }
}

module.exports = BotPlayer;