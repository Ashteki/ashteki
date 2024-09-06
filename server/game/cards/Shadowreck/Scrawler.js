const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Scrawler extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            target: {
                optional: true,
                activePromptTitle: 'Choose a card to exhaust',
                cardType: BattlefieldTypes,
                cardCondition: (card, context) => card.attack < context.player.countUnits('scrawler'),
                gameAction: ability.actions.exhaust({ showMessage: true })
            }
        });

        this.fearful();
    }
}

Scrawler.id = 'scrawler';

module.exports = Scrawler;
