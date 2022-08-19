const { BattlefieldTypes, CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class TidalShift extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Tidal Shift',
            targets: {
                tokenBoy: {
                    activePromptTitle: 'Choose an exhausted ready spell',
                    controller: 'self',
                    cardType: CardType.ReadySpell,
                    cardCondition: (card) => card.exhausted
                },
                receiver: {
                    activePromptTitle: 'Choose a unit to move the exhaustion token to',
                    dependsOn: 'tokenBoy',
                    cardType: BattlefieldTypes,
                    controller: 'opponent',
                    gameAction: ability.actions.moveToken((context) => ({
                        from: context.targets.tokenBoy,
                        to: context.targets.receiver,
                        type: 'exhaustion'
                    }))
                }
            }
        });
    }
}

TidalShift.id = 'tidal-shift';

module.exports = TidalShift;
