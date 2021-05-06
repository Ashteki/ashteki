const { BattlefieldTypes, Magic, Level } = require('../../../constants.js');
const Card = require('../../Card.js');
const Dice = require('../../dice.js');
const DiceCount = require('../../DiceCount.js');

class ConfusionSpores extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Confusion Spores',
            location: 'spellboard',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            target: {
                cardType: BattlefieldTypes,
                gameAction: ability.actions.cardLastingEffect(() => ({
                    duration: 'untilEndOfTurn',
                    effect: [
                        ability.effects.cardCannot('block'),
                        ability.effects.cardCannot('guard')
                    ]
                }))
            },
            then: {
                may: 'use the focus ability',
                condition: (context) =>
                    context.source.focus && // focused
                    Dice.canMatch(context.player.dice, [
                        new DiceCount(1, Level.Class, Magic.Sympathy)
                    ]),
                gameAction: [
                    ability.actions.exhaustDie((context) => ({
                        target: Dice.matchDice(context.player.dice, [
                            new DiceCount(1, Level.Class, Magic.Sympathy)
                        ])
                    })),
                    ability.actions.addSideAction()
                ]
            }
        });
    }
}

ConfusionSpores.id = 'confusion-spores';

module.exports = ConfusionSpores;
