const { Level, BattlefieldTypes, CardType, UpgradeCardTypes } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class TashCantasita extends Card {
    setupCardAbilities(ability) {
        this.forcedReaction({
            title: 'Steal',
            when: {
                onDamageApplied: (event, context) =>
                    event.damageEvent.card === context.player.opponent.phoenixborn &&
                    BattlefieldTypes.includes(event.damageSource.type) &&
                    event.damageEvent.fightEvent &&
                    event.damageEvent.damageSource.owner === context.player
            },
            limit: ability.limit.perTurn(1),
            gameAction: ability.actions.discardTopOfDeck((context) => ({
                target: context.player.opponent
            })),
            then: {
                target: {
                    cardType: UpgradeCardTypes,
                    location: 'discard',
                    controller: 'self',
                    gameAction: ability.actions.returnToHand({
                        location: 'discard',
                        showMessage: true
                    })

                }
            }
        });
    }
}

TashCantasita.id = 'tash-cantasita';

module.exports = TashCantasita;
