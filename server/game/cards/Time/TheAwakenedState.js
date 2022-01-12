const { BattlefieldTypes, CardType } = require('../../../constants.js');
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
                    gameAction: ability.actions.dealDamage((context) => ({
                        amount: 1,
                        showMessage: true,
                        target: context.player.opponent.phoenixborn
                    }))
                }
            }
        });
    }

    canAttach(card, context) {
        return card && card.getType() === CardType.Phoenixborn && this.canPlayAsUpgrade();
    }
}

TheAwakenedState.id = 'the-awakened-state';

module.exports = TheAwakenedState;
