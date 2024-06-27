const { CardType, Level, AspectTypes } = require('../../constants');
const Dice = require('../dice');
const Player = require('../player');
const ChimeraDefenceStrategy = require('./ChimeraDefenceStrategy');
const DefaultPinStrategy = require('./DefaultPinStrategy');
const NullPromptStrategy = require('./NullPromptStrategy');

class DummyPlayer extends Player {
    constructor(id, user, owner, game, clockdetails) {
        super(id, user, owner, game, clockdetails);
        // set this in descendent class constructor
        this.firstFiveStrategy = null;
        this.dicePinStrategy = new DefaultPinStrategy(this);
        this.defenderStrategy = new ChimeraDefenceStrategy(this, game);
        this.disStrategy = new NullPromptStrategy(this, 'no');
    }

    getBehaviourRoll() {
        const d12Roll = Dice.d12Roll();
        return d12Roll;
    }

    get isDummy() {
        return true;
    }

    get isBot() {
        return false;
    }

    get isChimera() {
        return false;
    }

    get ffStrategy() {
        return this.firstFiveStrategy;
    }

    get discardStrategy() {
        return this.disStrategy;
    }

    returnCardToThreatZone(card) {
        card.onLeavesPlay();
        card.flip();
    }

    getAttacker(from = 'left') {
        const candidates = from === 'right' ? this.unitsInPlay.slice().reverse() : this.unitsInPlay;
        for (const card of candidates) {
            if (card.canAttack()) {
                return card;
            }
        }
        return null;
    }

    // getRevealHandler() {
    //     const target = this.threatCards[0];
    //     const act = new RevealBehaviour(target);
    //     return () => this.game.resolveAbility(act.createContext(this));
    // }

    doAttack() {
        const attacker = this.getAttacker();
        const target = this.getAttackTarget(attacker);
        this.game.initiateAttack(target, attacker);
    }

    getAttackTarget(attacker) {
        if (
            this.opponent.unitsInPlay.length === 0 ||
            attacker.type !== CardType.Aspect ||
            attacker.target === 'jaw'
        ) {
            return this.opponent.phoenixborn;
        }

        const targetUnit = this.getTargetUnit(
            attacker.target,
            (u) => !u.anyEffect('cannotBeAttackTarget')
        );

        return targetUnit || this.opponent.phoenixborn;
    }

    getTargetUnit(direction, condition) {
        const unitsCopy = [...this.opponent.unitsInPlay];
        if (direction === 'right') {
            unitsCopy.reverse();
        }

        for (const unit of unitsCopy) {
            if (condition(unit)) {
                return unit;
            }
        }

        return null;
    }
}

module.exports = DummyPlayer;
