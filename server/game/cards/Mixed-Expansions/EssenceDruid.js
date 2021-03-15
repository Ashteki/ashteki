const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class EssenceDruid extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            title: 'Spell Recall',
            target: {
                activePromptTitle: 'Choose a ready spell to return to your hand',
                cardType: CardType.ReadySpell,
                location: 'discard',
                controller: 'self',
                gameAction: ability.actions.moveCard({ destination: 'hand' })
            }
        });

        this.tame({ amount: 2 });
    }
}

EssenceDruid.id = 'essence-druid';

module.exports = EssenceDruid;
