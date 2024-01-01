const { Level, Magic } = require('../../constants');
const RevealBehaviour = require('../BaseActions/RevealBehaviour');
const Card = require('../Card');
const ThenAbility = require('../ThenAbility');
const AbilityDsl = require('../abilitydsl');

class BehaviourCard extends Card {
    getImageStub() {
        return this.imageStub.replace('%s', this.owner.chimeraPhase);
    }

    getBehaviour(behaviourRoll, phase) {
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

    doPbBurnDamage(amount) {
        // must TARGET
        const act = this.action({
            target: {
                ignoreTargetCheck: true,
                autoTarget: (context) => context.player.opponent.phoenixborn,
                gameAction: AbilityDsl.actions.dealDamage({ amount: amount, showMessage: true })
            }
        });

        const context = act.createContext(this.owner);
        this.game.resolveAbility(context);
    }

    doUnitBurnDamage(amount, aim) {
        // must TARGET
        const act = this.action({
            target: {
                autoTarget: (context) =>
                    context.player.getTargetUnit(
                        aim,
                        (u) => !u.anyEffect('cannotBeDicePowerTarget')
                    ),
                gameAction: AbilityDsl.actions.dealDamage({ amount: amount, showMessage: true })
            }
        });

        const context = act.createContext(this.owner);
        this.game.resolveAbility(context);
    }

    doRageRaise(numDice = 1) {
        for (let i = 0; i < numDice; i++) {
            this.game.queueSimpleStep(() => {
                const basicDie = this.owner.getBasicDie(Magic.Rage);
                if (basicDie) {
                    AbilityDsl.actions
                        .raiseDie({ showMessage: true })
                        .resolve(basicDie, this.game.getFrameworkContext(this.owner));
                }
            });
        }
    }

    doSummon(cardId) {
        const act = this.action({
            gameAction: AbilityDsl.actions.summon({
                conjuration: cardId
            })
        });

        const context = act.createContext(this.owner);
        this.game.resolveAbility(context);
    }
}

module.exports = BehaviourCard;
