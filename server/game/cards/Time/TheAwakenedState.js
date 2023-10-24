const { BattlefieldTypes, PhoenixbornTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class TheAwakenedState extends Card {
    setupCardAbilities(ability) {
        this.spellGuard({
            match: this
        });

        this.action({
            inexhaustible: true,
            title: 'Awaken',
            cost: ability.costs.sideAction(),
            gameAction: ability.actions.removeStatus((context) => ({
                target: context.player.phoenixborn
            })),
            then: {
                target: {
                    controller: 'opponent',
                    activePromptTitle: 'Deal 1 damage',
                    cardType: BattlefieldTypes,
                    gameAction: ability.actions.dealDamage({
                        amount: 1,
                        showMessage: true
                    })
                },
                then: {
                    alwaysTriggers: true,
                    target: {
                        autoTarget: (context) => context.player.opponent.phoenixborn,
                        gameAction: ability.actions.dealDamage({
                            amount: 1,
                            showMessage: true
                        })
                    }
                }
            }
        });
    }

    canAttach(card, context) {
        return card && PhoenixbornTypes.includes(card.getType()) && this.canPlayAsUpgrade();
    }
}

TheAwakenedState.id = 'the-awakened-state';

module.exports = TheAwakenedState;
