const Card = require('../../Card.js');

class DeepFreeze extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.addStatusToken(() => ({ target: this, amount: 3 }))
        });

        this.whileAttached({
            inexhaustible: true,
            effect: [
                ability.effects.exhausted(),
                ability.effects.gainAbility('action', {
                    title: 'Thaw',
                    cost: ability.costs.sideAction(),
                    inexhaustible: true,
                    effect: 'remove 1 status from Deep Freeze',
                    gameAction: ability.actions.removeStatus({ target: this }),
                    then: {
                        condition: () => this.status === 0,
                        gameAction: ability.actions.discard({ target: this })
                    }
                })
            ]
        });
    }
}

DeepFreeze.id = 'deep-freeze';

module.exports = DeepFreeze;
