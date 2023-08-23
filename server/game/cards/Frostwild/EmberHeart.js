const { UpgradeCardTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class EmberHeart extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            effect: 'take up {1} from {2}',
            effectArgs: (context) => [context.target, context.target.parent],
            target: {
                optional: true,
                activePromptTitle: 'Choose an alteration spell to take up',
                cardType: UpgradeCardTypes,
                controller: 'self',
                cardCondition: (card) => card.parent.exhausted,
                gameAction: ability.actions.attach((context) => ({
                    target: context.source,
                    upgrade: context.target,
                    canTakeUpgradeInPlay: true
                }))
            }
        });

        this.alert();
    }
}

EmberHeart.id = 'ember-heart';

module.exports = EmberHeart;
