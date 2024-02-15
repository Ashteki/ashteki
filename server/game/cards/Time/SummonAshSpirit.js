const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonAshSpirit extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Ash Spirit',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Time)])
            ],
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'ash-spirit'
            }),
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.draw((context) => ({
                    target: [context.player, context.player.opponent]
                })),
                message: '{0} draws 1 card',
                then: {
                    alwaysTriggers: true,
                    condition: () => this.focus > 0,
                    gameAction: ability.actions.conditional({
                        condition: (context) => {
                            const opponentEvent = context.preThenEvents.find(
                                (e) => e.player === context.player.opponent
                            );
                            return opponentEvent.context.drawResult.cardsDrawn == 0;
                        },
                        trueGameAction: ability.actions.chosenDiscard({
                            player: this.controller.opponent
                        })
                    })
                }
            }
        });
    }
}

SummonAshSpirit.id = 'summon-ash-spirit';

module.exports = SummonAshSpirit;
