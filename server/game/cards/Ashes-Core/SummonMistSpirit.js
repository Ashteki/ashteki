const Card = require('../../Card.js');

class SummonMistSpirit extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Mist Spirit',
            cost: [
                ability.costs.mainAction(),
                ability.costs.die({ magic: 'illusion', level: 'class' })
            ],
            location: 'spellboard',
            target: {
                player: 'self',
                cardType: 'Conjuration',
                cardCondition: (card) => card.id === 'mist-spirit',
                location: 'archives',
                gameAction: ability.actions.putIntoPlay()
            }
            //todo: pay another basic to summon another mist spirit
        });
    }
}

SummonMistSpirit.id = 'summon-mist-spirit';

module.exports = SummonMistSpirit;
