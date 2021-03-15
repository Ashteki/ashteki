const Card = require('../../Card.js');

class SummonShiningHydra extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Summon Shining Hydra',
            target: {
                controller: 'self',
                cardType: 'Conjuration',
                cardCondition: (card) => card.id === 'shining-hydra',
                location: 'archives',
                gameAction: ability.actions.putIntoPlay()
            }
        });
    }
}

SummonShiningHydra.id = 'summon-shining-hydra';

module.exports = SummonShiningHydra;
