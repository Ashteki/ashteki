const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');
const { BattlefieldTypes, Level, Magic } = require('../../../constants.js');

class SecretDoor extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Secret Door a unit',
            cost: [
                ability.costs.sideAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Illusion)])
            ],
            location: 'spellboard',
            target: {
                cardCondition: (card, context) => card !== context.source,
                controller: 'self',
                cardType: BattlefieldTypes,
                duration: 'untilEndOfTurn',
                gameAction: ability.actions.cardLastingEffect(() => ({
                    effect: ability.effects.addKeyword({ preventblock: 1 })
                }))
            }
        });
    }
}

SecretDoor.id = 'secret-door';

module.exports = SecretDoor;
