const { BattlefieldTypes, CardType, PhoenixbornTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class WaveCrash extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Wave Crash',
            target: {
                activePromptTitle: 'Choose a unit to remove a status token from',
                controller: 'self',
                cardType: BattlefieldTypes,
                cardCondition: (card) => card.status > 0,
                gameAction: ability.actions.removeStatus()
            },
            then: {
                target: {
                    activePromptTitle: 'Choose a unit or phoenixborn to deal damage to',
                    cardType: [...BattlefieldTypes, ...PhoenixbornTypes],
                    controller: 'opponent',
                    gameAction: ability.actions.dealDamage((context) => ({
                        amount: PhoenixbornTypes.includes(context.target.type) ? 1 : 2,
                    }))
                }
            }
        });
    }
}

WaveCrash.id = 'wave-crash';

module.exports = WaveCrash;
