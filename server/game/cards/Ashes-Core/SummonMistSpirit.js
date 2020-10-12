const Card = require('../../Card.js');

class SummonMistSpirit extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Mist Spirit',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.die({ magic: 'illusion', level: 'class' })
            ],
            location: 'spellboard',
            target: {
                player: 'self',
                cardType: 'Conjuration',
                cardCondition: (card) => card.id === 'mist-spirit',
                location: 'archives',
                gameAction: ability.actions.putIntoPlay()
            },
            then: {
                cost: ability.costs.dice([{ level: 'basic' }]),
                target: {
                    player: 'self',
                    cardType: 'Conjuration',
                    cardCondition: (card) => card.id === 'mist-spirit',
                    location: 'archives',
                    gameAction: ability.actions.putIntoPlay()
                }
            }
        });
    }
}

SummonMistSpirit.id = 'summon-mist-spirit';

module.exports = SummonMistSpirit;
