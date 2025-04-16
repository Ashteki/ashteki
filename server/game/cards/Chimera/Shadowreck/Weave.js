const AspectCard = require('../../../solo/AspectCard');

class Weave extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.statusAbility({
            target: {
                mode: 'auto',
                cardCondition: (card) => !card.anyEffect('webbed'),
                gameAction: ability.actions.attachConjuredAlteration({
                    conjuredAlteration: 'webbed'
                })
            }
        });
    }
}

Weave.id = 'weave';

module.exports = Weave;
