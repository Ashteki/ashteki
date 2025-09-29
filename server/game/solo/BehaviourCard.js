const { Magic, Level } = require('../../constants');
const RevealBehaviour = require('../BaseActions/RevealBehaviour');
const Card = require('../Card');
const ThenAbility = require('../ThenAbility');
const AbilityDsl = require('../abilitydsl');

class BehaviourCard extends Card {
    get isMovable() {
        return false;
    }

    getMenu() {
        return undefined;
    }

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

    doAttack(attackWith, from) {
        if (attackWith && !attackWith.canAttack()) {
            return;
        }

        const attackAbility = this.behaviour({
            title: 'Attack',
            gameAction: AbilityDsl.actions.attack((context) => {
                const attacker = attackWith || context.player.getAttacker(from);
                return {
                    attacker: attacker,
                    target: context.player.getAttackTarget(attacker)
                }
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

    doBasicRageReroll(numDice = 1) {
        const act = this.action({
            target: {
                toSelect: 'die',
                autoTarget: (context) =>
                    context.player.dice.filter((d) => d.level === Level.Basic).slice(0, numDice),
                gameAction: AbilityDsl.actions.rerollDice()
            }
        });

        const context = act.createContext(this.owner);
        this.game.resolveAbility(context);
    }

    doSummon(cardId, count = 1) {
        const act = this.action({
            gameAction: AbilityDsl.actions.summon({
                conjuration: cardId,
                count: count
            })
        });

        const context = act.createContext(this.owner);
        this.game.resolveAbility(context);
    }

    doLowerOpponentsDice(numDice) {
        if (this.owner.opponent.activeNonBasicDiceCount === 0) {
            return;
        }

        let titleText =
            numDice === 1 ? 'Choose a die to lower' : 'Choose ' + numDice + ' dice to lower';
        const ability = this.behaviour({
            cost: AbilityDsl.costs.sideAction(),
            title: 'Chimera Behaviour',
            target: {
                activePromptTitle: titleText,
                player: 'opponent',
                targetsPlayer: true,
                toSelect: 'die',
                mode: 'exactly',
                numDice: Math.min(numDice, this.owner.opponent.activeNonBasicDiceCount),
                dieCondition: (die) => !die.exhausted && die.level !== Level.Basic,
                owner: 'opponent',
                gameAction: AbilityDsl.actions.lowerDie()
            },
            message: '{0} uses {1} to lower ' + numDice + ' opponent dice'
        });

        const context = ability.createContext(this.owner);
        this.game.resolveAbility(context);
    }

}

module.exports = BehaviourCard;
