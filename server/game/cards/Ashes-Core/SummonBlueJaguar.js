const Card = require('../../Card.js');

class SummonBlueJaguar extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Blue Jaguar',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([{ level: 'basic' }, { level: 'basic' }])
            ],
            location: 'spellboard',
            target: {
                player: 'self',
                cardType: 'Conjuration',
                cardCondition: (card) => card.id === 'blue-jaguar',
                location: 'archives',
                gameAction: ability.actions.putIntoPlay()
            }
        });
    }
}

SummonBlueJaguar.id = 'summon-blue-jaguar';

module.exports = SummonBlueJaguar;
