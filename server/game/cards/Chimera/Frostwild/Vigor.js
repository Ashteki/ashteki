const { Level } = require('../../../../constants.js');
const Card = require('../../../Card.js');

class Vigor extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.modifyAttack(1),
                ability.effects.gainAbility('destroyed', {
                    inexhaustible: true,
                    target: {
                        toSelect: 'die',
                        autoTarget: (context) =>
                            context.source.owner.dice.find((d) => d.level === Level.Basic),
                        gameAction: ability.actions.rerollDice()
                    }
                })
            ]
        });
    }
}

Vigor.id = 'vigor';

module.exports = Vigor;
