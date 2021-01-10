const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Fear extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Choose a unit to destroy',
                player: 'self',
                cardType: BattlefieldTypes,
                gameAction: [
                    ability.actions.destroy(),
                    ability.actions.removeDamage((context) => ({
                        amount: context.target.recover,
                        target: context.source.owner.phoenixborn
                    }))
                ]
            },
            then: {
                target: {
                    activePromptTitle: 'Choose a unit to discard',
                    controller: 'opponent',
                    cardType: BattlefieldTypes,
                    gameAction: ability.actions.discard()
                }
            }
        });
    }
}

Fear.id = 'fear';

module.exports = Fear;
