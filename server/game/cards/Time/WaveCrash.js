const { BattlefieldTypes, CardType } = require('../../../constants.js');
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
                    cardType: [...BattlefieldTypes, CardType.Phoenixborn],
                    controller: 'opponent',
                    gameAction: ability.actions.dealDamage((context) => ({
                        amount: context.target.type === CardType.Phoenixborn ? 1 : 2,
                    }))
                }
            }
        });
    }
}

WaveCrash.id = 'wave-crash';

module.exports = WaveCrash;
