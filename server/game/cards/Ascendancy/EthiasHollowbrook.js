const { Level, CardType, BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class EthiasHollowbrook extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Erase',
            cost: [
                ability.costs.sideAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Basic)])
            ],
            target: {
                activePromptTitle: 'Choose a ready spell to remove from the game',
                cardType: CardType.ReadySpell,
                location: 'spellboard',
                gameAction: ability.actions.purge()
            },
            then: {
                condition: (context) => context.preThenEvent.context.target,
                target: {
                    showCancel: true,
                    activePromptTitle: 'Choose a unit to deal 2 damage to',
                    cardType: BattlefieldTypes,
                    controller: 'opponent',
                    gameAction: ability.actions.dealDamage({ amount: 2 })
                },
                then: {
                    target: {
                        autoTarget: (context) => context.player.opponent.phoenixborn,
                        gameAction: ability.actions.dealDamage({ amount: 1 })
                    }
                }
            }
        });
    }
}

EthiasHollowbrook.id = 'ethias-hollowbrook';

module.exports = EthiasHollowbrook;
