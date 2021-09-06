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
                gameAction: ability.actions.draw(),
                message: '{0} draws 1 card',
                then: (context) => {
                    let result = {
                        alwaysTriggers: true
                    };

                    if (context.player.opponent.deck.length > 0) {
                        result.gameAction = ability.actions.draw((context) => ({
                            target: [context.player.opponent]
                        }));
                        result.message = '{3} draws 1 card';
                        result.messageArgs = (innerContext) => {
                            return innerContext.player.opponent;
                        };
                    } else {
                        result.condition = () => this.focus > 0;
                        result.gameAction = ability.actions.chosenDiscard({
                            player: this.controller.opponent
                        });
                    }
                    return result;
                }
            }
        });
    }
}

SummonAshSpirit.id = 'summon-ash-spirit';

module.exports = SummonAshSpirit;
