const { Level, Magic, BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonCinderSpirit extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Place Token',
            cost: [ability.costs.mainAction(), ability.costs.exhaust()],
            gameAction: ability.actions.addStatusToken({ amount: 1 })
        });

        this.action({
            inexhaustible: true,
            title: 'Summon Cinder Spirit',
            cost: [
                ability.costs.sideAction(),
                ability.costs.dice([
                    new DiceCount(1, Level.Class, Magic.Time),
                    new DiceCount(1, Level.Basic)
                ])
            ],
            location: 'spellboard',
            target: {
                activePromptTitle: 'Choose a unit to move a status token to',
                cardCondition: (card, context) => card !== context.source,
                cardType: BattlefieldTypes,
                controller: 'self',
                gameAction: ability.actions.moveToken((context) => ({
                    from: context.source,
                    to: context.target,
                    type: 'status'
                }))
            },
            then: {
                gameAction: ability.actions.conditional({
                    condition: (context) => context.preThenEvents.every((e) => e.resolved),
                    trueGameAction: ability.actions.summon({
                        conjuration: 'cinder-spirit'
                    })
                })
            }
        });
    }
}

SummonCinderSpirit.id = 'summon-cinder-spirit';

module.exports = SummonCinderSpirit;
