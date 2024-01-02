const { PhoenixbornTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class RuinDweller extends Card {
    setupCardAbilities(ability) {
        this.afterDestroyedDefending({
            title: 'Blight 1',
            target: {
                activePromptTitle: 'Choose a Phoenixborn to deal 1 damage to',
                cardType: PhoenixbornTypes,
                gameAction: ability.actions.dealDamage()
            }
        });

        this.forcedInterrupt({
            title: 'Blight 1',
            when: {
                onRoundEnded: () => true
            },
            target: {
                activePromptTitle: 'Choose a Phoenixborn to deal 1 damage to',
                cardType: PhoenixbornTypes,
                gameAction: ability.actions.dealDamage()
            }
        });
    }
}

RuinDweller.id = 'ruin-dweller';

module.exports = RuinDweller;
