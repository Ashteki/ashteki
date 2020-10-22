const Card = require('../../Card.js');

class SummonSilverSnake extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Silver Snake',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    { magic: 'charm', level: 'power' },
                    { magic: 'natural', level: 'power' }
                ])
            ],
            location: 'spellboard',
            target: {
                player: 'self',
                cardType: 'Conjuration',
                cardCondition: (card) => card.id === 'silver-snake',
                location: 'archives',
                gameAction: ability.actions.putIntoPlay()
            }
        });
    }
}

SummonSilverSnake.id = 'summon-silver-snake';

module.exports = SummonSilverSnake;
