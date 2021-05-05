const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Blink extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'remove {0} from play until the end of the turn',
            target: {
                cardType: BattlefieldTypes,
                gameAction: ability.actions.purge()
            },
            then: (thenContext) => ({
                gameAction: ability.actions.lastingEffect({
                    when: {
                        onTurnEnded: () => true
                    },
                    gameAction: ability.actions.putIntoPlay({
                        target: thenContext.target
                    })
                })
            })
        });
    }
}

Blink.id = 'blink';

module.exports = Blink;
