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
            gameAction: ability.actions.summon({
                conjuration: 'brilliant-thorn',
                count: 2
            })
        });
    }
}

LuminousSeedling.id = 'luminous-seedling';

module.exports = LuminousSeedling;
