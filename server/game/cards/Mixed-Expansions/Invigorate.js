const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Invigorate extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Invigorate: choose up to 3 units',
                mode: 'upTo',
                numCards: 3,
                controller: 'self',
                cardType: BattlefieldTypes,
                gameAction: ability.actions.addStatusToken()
            }
        });
    }
}

Invigorate.id = 'invigorate';

module.exports = Invigorate;
