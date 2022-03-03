const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonWishingWing extends Card {
    setupCardAbilities(ability) {
        this.spellGuard({
            location: 'spellboard'
        });

        this.action({
            title: 'Summon Wishing Wing',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Time)])
            ],
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'wishing-wing'
            }),
            then: {
                condition: (context) => context.source.focus >= 2,
                gameAction: ability.actions.addStatusToken((context) => ({
                    target: context.preThenEvent.cards
                }))
            }
        });
    }
}

SummonWishingWing.id = 'summon-wishing-wing';

module.exports = SummonWishingWing;
