const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Shadowblade extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onAttackersDeclared: () => true
            },
            gameAction: ability.actions.draw({ amount: 2 }),
            then: {
                target: {
                    activePromptTitle: 'Choose a unit to receive damage',
                    cardType: BattlefieldTypes,
                    controller: 'opponent',
                    gameAction: ability.actions.dealDamage((context) => ({ amount: 1 }))
                },
                then: (preThenContext) => ({
                    target: {
                        activePromptTitle: 'Choose another to receive damage',
                        cardCondition: (card, context) => card !== preThenContext.target,
                        cardType: BattlefieldTypes,
                        controller: 'opponent',
                        gameAction: ability.actions.dealDamage((context) => ({ amount: 1 }))
                    },
                })
            }
        })
    }

}

Shadowblade.id = 'shadowblade';

module.exports = Shadowblade;
