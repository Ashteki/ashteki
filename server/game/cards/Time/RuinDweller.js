const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class RuinDweller extends Card {
    setupCardAbilities(ability) {
        this.afterDestroyedDefending({
            title: 'Blight 1',
            target: {
                cardType: CardType.Phoenixborn,
                gameAction: ability.actions.dealDamage()
            }
        });

        this.forcedInterrupt({
            title: 'Blight 1',
            when: {
                onRoundEnded: () => true
            },
            target: {
                cardType: CardType.Phoenixborn,
                gameAction: ability.actions.dealDamage()
            }
        });
    }
}

RuinDweller.id = 'ruin-dweller';

module.exports = RuinDweller;
