const { CardType, ActionType } = require('../../constants');
const Dice = require('../dice');
const Player = require('../player');
const DefaultPinStrategy = require('./DefaultPinStrategy');
const NullPromptStrategy = require('./NullPromptStrategy');

class DummyPlayer extends Player {
    constructor(id, user, owner, game, clockdetails) {
        super(id, user, owner, game, clockdetails);
        // set this in descendent class constructor
        this.firstFiveStrategy = null;
        this.dicePinStrategy = new DefaultPinStrategy(this);
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
        const attackers = [attacker];
        const target = this.getAttackTarget(attacker);
        this.addCoAttackers(attacker, attackers);
        this.game.initiateAttack(target, attackers);
    }

    addCoAttackers(attacker, attackers) {
        if (attacker.target === 'center') {
            // add all other center attackers
            const attackBuddies = this.getCenterAttackAspects([attacker]);
            attackBuddies.forEach(b => attackers.push(b));
        }
    }

    getCenterAttackAspects(excludeList) {
        return this.unitsInPlay.filter(
            (u) => u.target === 'center' && !excludeList.includes(u) && u.canAttack()
        );
    }

    getAttackTarget(attacker) {
        if (
            this.opponent.unitsInPlay.length === 0 ||
            attacker.type !== CardType.Aspect ||
            ['jaw', 'center'].includes(attacker.target)
        ) {
            return this.opponent.phoenixborn;
        }

        const targetUnit = this.getTargetUnit(attacker.target, ActionType.Attack);

        return targetUnit || this.opponent.phoenixborn;
    }

    getTargetUnit(direction, targetType) {
        const unitsCopy = [...this.opponent.unitsInPlay];
        if (direction === 'right') {
            unitsCopy.reverse();
        }

        const targetConditions = {
            [ActionType.DicePower]: (u) => !u.anyEffect('cannotBeDicePowerTarget'),
            [ActionType.Attack]: (u) => !u.anyEffect('cannotBeAttackTarget')
        };

        for (const unit of unitsCopy) {
            if (targetConditions[targetType](unit)) {
                return unit;
            }
        }

        return null;
    }
}

module.exports = DummyPlayer;
