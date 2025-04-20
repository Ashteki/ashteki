const Card = require('../../Card.js');

class LuminousSeedling extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: [ability.effects.modifyLife(() => this.status)]
        });

        this.action({
            title: 'Blossom',
            cost: [
                ability.costs.mainAction()
            ],
            gameAction: ability.actions.destroy(),
            then: {
                condition: (context) => context.preThenEvent.clone.status >= 2,
                gameAction: ability.actions.summon({
                    conjuration: 'brilliant-thorn',
                    count: 2
                })
            }
        });
    }
}

LuminousSeedling.id = 'luminous-seedling';

module.exports = LuminousSeedling;
