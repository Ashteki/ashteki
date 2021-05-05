const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Blink extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: BattlefieldTypes,
                gameAction: ability.actions.sequential([
                    // ability.actions.purge(),
                    ability.actions.cardLastingEffect(() => ({
                        duration: 'lastingEffect',
                        effect: ability.effects.delayedEffect({
                            when: {
                                onTurnEnded: () => true
                            },
                            gameAction: ability.actions.putIntoPlay()
                        })
                    }))
                ])
            },
            effect: 'remove {0} from play until the end of the turn'
        })
    }
}

Blink.id = 'blink';

module.exports = Blink;
