const Card = require('../../Card.js');

class LuminousSeedling extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: [ability.effects.modifyLife(() => this.status)]
        });

        this.action({
            title: 'Blossom',
            cost: [
                ability.costs.mainAction(),
                ability.costs.loseStatus(2),
                ability.costs.destroy()
            ],
            target: {
                mode: 'upTo',
                numCards: 2,
                controller: 'self',
                cardType: 'Conjuration',
                cardCondition: (card) => card.id === 'brilliant-thorn',
                location: 'archives',
                gameAction: ability.actions.putIntoPlay()
            }
        });
    }
}

LuminousSeedling.id = 'luminous-seedling';

module.exports = LuminousSeedling;
