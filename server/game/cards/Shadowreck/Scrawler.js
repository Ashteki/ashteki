const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Scrawler extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            target: {
                activePromptTitle: 'Choose a card to exhaust',
                cardType: BattlefieldTypes,
                cardCondition: (card, context) =>
                    !card.exhausted && card.attack < context.player.countUnits('scrawler'),
                gameAction: ability.actions.exhaust({ showMessage: true })
            }
        });
    }
}

Scrawler.id = 'scrawler';

module.exports = Scrawler;
