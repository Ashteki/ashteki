const Card = require('../../Card.js');

class SummonSeasideRaven extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Seaside Raven',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([{ level: 'basic' }, { level: 'basic' }, { level: 'basic' }])
            ],
            location: 'spellboard',
            target: {
                player: 'self',
                cardType: 'Conjuration',
                cardCondition: (card) => card.id === 'seaside-raven',
                location: 'archives',
                gameAction: ability.actions.putIntoPlay()
            }
        });
    }
}

SummonSeasideRaven.id = 'summon-seaside-raven';

module.exports = SummonSeasideRaven;
