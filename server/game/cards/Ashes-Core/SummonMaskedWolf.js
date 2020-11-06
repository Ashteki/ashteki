const Card = require('../../Card.js');

class SummonMaskedWolf extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon False Demon',
            cost: [
                ability.costs.sideAction(),
                ability.costs.exhaust(),
                ability.costs.dice([{ magic: 'illusion', level: 'class' }])
            ],
            location: 'spellboard',
            target: {
                player: 'self',
                cardType: 'Conjuration',
                cardCondition: (card) => card.id === 'masked-wolf',
                location: 'archives',
                gameAction: ability.actions.putIntoPlay()
            }
        });
    }
}

SummonMaskedWolf.id = 'summon-masked-wolf';

module.exports = SummonMaskedWolf;
