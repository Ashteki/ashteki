const { CardType, PhoenixbornTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class RuinDweller extends Card {
    setupCardAbilities(ability) {
        this.afterDestroyedDefending({
            title: 'Blight 1',
            target: {
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
                cardType: PhoenixbornTypes,
                gameAction: ability.actions.dealDamage()
            }
        });
    }
}

RuinDweller.id = 'ruin-dweller';

module.exports = RuinDweller;
