const Card = require('../../Card.js');

class Hostage extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            inexhaustible: true,
            effect: [ability.effects.exhausted(), ability.effects.cannotBeAttackTarget()]
        });

        this.action({
            title: 'Ransom',
            cost: [ability.costs.mainAction(), ability.costs.chosenDiscard()],
            gameAction: [
                ability.actions.discard({ target: this }),
                ability.actions.draw((context) => {
                    return { target: context.source.owner, amount: 1 };
                })
            ]
        });
    }
}

Hostage.id = 'hostage';

module.exports = Hostage;
