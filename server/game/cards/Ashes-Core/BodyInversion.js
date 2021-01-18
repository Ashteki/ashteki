const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class BodyInversion extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Body Inversion a unit',
            location: 'spellboard',
            cost: [
                ability.costs.sideAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Illusion)])
            ],
            target: {
                cardType: ['Ally', 'Conjuration'],
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    duration: 'untilEndOfTurn',
                    effect: [
                        ability.effects.setAttack(() => {
                            const printedLife =
                                context.target.mostRecentEffect('setPrintedLife') ||
                                context.target.printedLife;
                            return Math.max(
                                0,
                                printedLife + context.target.sumEffects('modifyAttack')
                            );
                        }),
                        ability.effects.setLife(() => {
                            const printedAttack =
                                context.target.mostRecentEffect('setPrintedAttack') ||
                                context.target.printedAttack;
                            return printedAttack + context.target.sumEffects('modifyLife');
                        })
                    ]
                }))
            }
        });
    }
}

BodyInversion.id = 'body-inversion';

module.exports = BodyInversion;
