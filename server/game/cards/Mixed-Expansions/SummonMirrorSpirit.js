const { Level, Magic, BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonMirrorSpirit extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Mirror Spirit',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    new DiceCount(1, Level.Class, Magic.Sympathy),
                    new DiceCount(1, Level.Basic)
                ])
            ],
            location: 'spellboard',
            target: {
                controller: 'self',
                cardType: 'Conjuration',
                cardCondition: (card) => card.id === 'mirror-spirit',
                location: 'archives',
                gameAction: ability.actions.putIntoPlay()
            },
            then: {
                alwaysTriggers: true,
                condition: () => this.focus > 0,
                target: {
                    activePromptTitle: 'Choose a mirror spirit with status tokens',
                    cardCondition: (card) => card.id === 'mirror-spirit' && card.status > 0,
                    controller: 'self',
                    gameAction: ability.actions.removeStatus({ all: true })
                },
                then: {
                    target: {
                        activePromptTitle: 'Choose a unit to exhaust',
                        cardType: BattlefieldTypes,
                        gameAction: ability.actions.exhaust()
                    }
                }
            }
        });
    }
}

SummonMirrorSpirit.id = 'summon-mirror-spirit';

module.exports = SummonMirrorSpirit;
