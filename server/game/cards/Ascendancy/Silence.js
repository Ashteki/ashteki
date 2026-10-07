const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Silence extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Choose a unit to exhaust',
                showCancel: true,
                cardType: BattlefieldTypes,
                controller: 'opponent',
                gameAction: ability.actions.exhaust()
            },
            then: {
                target: {
                    activePromptTitle: 'Choose an exhausted unit to destroy',
                    optional: true,
                    cardType: BattlefieldTypes,
                    cardCondition: (card) => card.exhausted,
                    controller: 'opponent',
                    gameAction: ability.actions.destroy()
                }
            }
        });
    }
}

Silence.id = 'silence';

module.exports = Silence;
