const { Level } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class MajesticTitan extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.addKeyword({ gigantic: 2 })
        });

        this.action({
            inexhaustible: true,
            title: 'Renew',
            cost: [ability.costs.mainAction(), ability.costs.dice([new DiceCount(1, Level.Basic)])],
            target: {
                controller: 'self',
                location: 'spellboard',
                cardCondition: (card) => card.id === 'summon-majestic-titan',
                gameAction: ability.actions.discard()
            },
            then: {
                message: 'All exhaustion tokens and alterations are removed from {1}',
                gameAction: [
                    ability.actions.removeExhaustion((context) => ({
                        all: true,
                        target: context.source
                    })),
                    ability.actions.discard((context) => ({
                        target: context.source.upgrades
                    }))
                ]
            }
        });
    }
}

MajesticTitan.id = 'majestic-titan';

module.exports = MajesticTitan;
