const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Fear extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Choose a unit to destroy',
                player: 'self',
                cardType: BattlefieldTypes,
                gameAction: [ability.actions.destroy()]
            },
            then: {
                gameAction: ability.actions.removeDamage((context) => ({
                    amount: context.preThenEvent.context.target.recover,
                    target: context.source.owner.phoenixborn
                })),
                then: {
                    alwaysTriggers: true,
                    target: {
                        activePromptTitle: 'Choose a unit to discard',
                        controller: 'opponent',
                        cardType: BattlefieldTypes,
                        gameAction: ability.actions.discard()
                    }
                }
            }
        });
    }
}

Fear.id = 'fear';

module.exports = Fear;
