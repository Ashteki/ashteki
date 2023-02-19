const { CardType } = require("../../constants");
const RevealAct = require("../BaseActions/RevealAct");
const Player = require("../player");
const ChimeraFFStrategy = require("./ChimeraFFStrategy");
const ChimeraPinStrategy = require("./ChimeraPinStrategy");
const NullPromptStrategy = require("./NullPromptStrategy");

class DummyPlayer extends Player {
    constructor(id, user, owner, game, clockdetails) {
        super(id, user, owner, game, clockdetails);
        this.firstFiveStrategy = new ChimeraFFStrategy(this);
        this.dicePinStrategy = new ChimeraPinStrategy(this);
        this.disStrategy = new NullPromptStrategy(this, 'no');
        this.behaviourRoll = 0;
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
        const amount = this.phoenixborn.threat - this.cardsInPlay.length;
        const cards = this.deck.slice(0, amount);
        cards.forEach(c => {
            this.moveCard(c, 'threatZone');
        })
    }

    getState(activePlayer) {
        const result = super.getState(activePlayer);
        result.cardPiles.threatZone = this.getSummaryForCardList(this.threatZone, activePlayer)

        return result;
    }

    getAttacker() {
        for (const card of this.cardsInPlay) {
            if (card.canAttack()) {
                return card;
            }
        }
        return null;
    }

    getRevealHandler() {
        const target = this.threatZone[0];
        const act = new RevealAct(target);
        return () => this.game.resolveAbility(act.createContext(this));
    }

    doAttack() {
        const attacker = this.getAttacker();
        const target = this.getAttackTarget(attacker);
        this.game.initiateAttack(target, attacker);
    }

    getAttackTarget(attacker) {
        const opponentUnits = [...this.opponent.unitsInPlay];
        if (
            opponentUnits.length === 0
            || attacker.type !== CardType.Aspect
            || attacker.target === 'jaw'
        ) {
            return this.opponent.phoenixborn;
        }

        //check for targetability
        if (attacker.target === 'right') {
            opponentUnits.reverse();
        }

        for (const unit of opponentUnits) {
            if (!unit.anyEffect('cannotBeAttackTarget')) {
                return unit;
            }
        }

        return this.opponent.phoenixborn;
    }
}

module.exports = DummyPlayer;