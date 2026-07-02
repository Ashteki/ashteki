const { Level, BattlefieldTypes, CardType } = require('../../constants');
const AbilityDsl = require('../abilitydsl');
const Card = require('../Card');
const ThenAbility = require('../ThenAbility');

class PvEReadySpell extends Card {
    get isMovable() {
        return false;
    }

    // internal utility method for building a behaviour ability
    behaviour(properties) {
        return new ThenAbility(this.game, this.owner.phoenixborn, properties);
    }

    lowerOpponentsDice(numDice) {
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
                owner: 'opponent',
                gameAction: AbilityDsl.actions.lowerDie()
            },
            message: '{0} uses {1} to lower ' + numDice + ' opponent dice'
        });

        return ability;
    }

    pbOrRightmostDamage() {
        const ability = this.behaviour({
            target: {
                activePromptTitle: (context) => 'Choose a card to receive 1 wound',
                player: 'opponent',
                targetsPlayer: true,
                controller: 'opponent',
                cardType: [...BattlefieldTypes, CardType.Phoenixborn],
                cardCondition: (card, context) =>
                    card.type === CardType.Phoenixborn || card.owner.isRightmostUnit(card),
                gameAction: AbilityDsl.actions.dealDamage({ amount: 1 }),
            }
        });

        return ability;
    }

    millOrDamage() {
        const ability = this.behaviour({
            target: {
                toSelect: 'player',
                ignoreTargetCheck: true,
                autoTarget: (context) => context.player.opponent,
                gameAction: AbilityDsl.actions.chooseAction((context) => ({
                    target: context.target,
                    player: context.target,
                    choices: {
                        Discard: AbilityDsl.actions.chosenDiscard({ allowTopOfDeck: true }),
                        '1 Pb Damage': AbilityDsl.actions.dealDamage((context) => ({
                            target: context.player.opponent.phoenixborn,
                            amount: 1
                        }))
                    }
                }))
            }
        });

        return ability;
    }

    aoEDamage(amount, title) {
        const ability = this.ultimate({
            effect: 'deal {0} damage to all opponent units and phoenixborn',
            effectArgs: () => amount,
            target: {
                ignoreTargetCheck: true,
                autoTarget: (context) => context.player.opponent.unitsInPlay,
                gameAction: AbilityDsl.actions.orderedAoE({
                    gameAction: AbilityDsl.actions.dealDamage({ amount: amount }),
                    promptTitle: title
                })
            }
        });

        return ability;
    }

    damageLeftmost(amount, addAspect) {
        const spec = {
            target: {
                mode: 'auto',
                aim: 'left',
                gameAction: AbilityDsl.actions.dealDamage({ amount: amount })
            }
        };
        if (addAspect) {
            spec.then = ({
                alwaysTriggers: true,
                gameAction: AbilityDsl.actions.addToThreatZone()
            })
        }
        const ability = this.ultimate(spec);

        return ability;
    }
}

module.exports = PvEReadySpell;