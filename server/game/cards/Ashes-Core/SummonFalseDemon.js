const Card = require('../../Card.js');

class SummonFalseDemon extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon False Demon',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([{ magic: 'illusion', level: 'class' }, { level: 'basic' }])
            ],
            location: 'spellboard',
            target: {
                player: 'self',
                cardType: 'Conjuration',
                cardCondition: (card) => card.id === 'false-demon',
                location: 'archives',
                gameAction: ability.actions.putIntoPlay()
            }
        });
    }
}

SummonFalseDemon.id = 'summon-false-demon';

module.exports = SummonFalseDemon;
