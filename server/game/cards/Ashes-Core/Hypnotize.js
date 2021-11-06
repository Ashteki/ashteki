const { BattlefieldTypes, Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class Hypnotize extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Hypnotize a unit',
            location: 'spellboard',
            cost: [
                ability.costs.sideAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(2, Level.Class, Magic.Charm)])
            ],
            target: {
                cardType: BattlefieldTypes,
                controller: 'self',
                gameAction: ability.actions.cardLastingEffect({
                    duration: 'untilEndOfTurn',
                    effect: ability.effects.gainAbility('persistentEffect', {
                        effect: ability.effects.bypass()
                    })
                })
            }
        });
    }
}

Hypnotize.id = 'hypnotize';

module.exports = Hypnotize;
