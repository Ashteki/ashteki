const { Level } = require('../../constants');
const RevealBehaviour = require('../BaseActions/RevealBehaviour');
const Card = require('../Card');
const ThenAbility = require('../ThenAbility');
const AbilityDsl = require('../abilitydsl');

class BehaviourCard extends Card {
    getImageStub() {
        return this.imageStub.replace('%s', this.owner.chimeraPhase);
    }

    getBehaviour(behaviourRoll) {
        // override this in derived classes
    }

    // internal utility method for building a behaviour ability
    behaviour(properties) {
        return new ThenAbility(this.game, this.owner.phoenixborn, properties);
    }

    doAddRedRains() {
        const ability = this.behaviour({
            preferActionPromptMessage: true,
            gameAction: AbilityDsl.actions.addRedRainsToken({
                showMessage: true,
                shortMessage: true,
                warnMessage: true
            })
        });
        const context = ability.createContext(this.owner);
        this.game.resolveAbility(context);
    }

    doReveal() {
        const target = this.owner.threatCards[0];
        const act = new RevealBehaviour(target);
        const context = act.createContext(this.owner);
        this.game.resolveAbility(context);
        return target;
    }

    canAttack() {
        return this.owner.canAttack();
    }

    doAttack(attackWith) {
        const attacker = attackWith || this.owner.getAttacker();
        const target = this.owner.getAttackTarget(attacker);

        const attackAbility = this.behaviour({
            title: 'Attack',
            gameAction: AbilityDsl.actions.attack({
                attacker: attacker,
                target: target
            })
        });

        const context = attackAbility.createContext(this.owner);
        this.game.resolveAbility(context);
    }

    doPbBurnDamage(amount) { }

    doRageRaise(numDice) {
        const basicDie = this.owner.dice.find((die) => die.level === Level.Basic);
        if (basicDie) {
            AbilityDsl.actions
                .raiseDie({ showMessage: true })
                .resolve(basicDie, this.game.getFrameworkContext(this.owner));
        }
    }
}

module.exports = BehaviourCard;
