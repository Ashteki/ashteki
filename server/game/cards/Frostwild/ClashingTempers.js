const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class ClashingTempers extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.player.unitsInPlay.length > 1,
            effect: 'add fire and ice adaptations to two units',
            targets: {
                fire: {
                    activePromptTitle: 'Choose a unit to receive a fire adaptation',
                    cardType: BattlefieldTypes,
                    controller: 'self'
                },
                ice: {
                    activePromptTitle: 'Choose a unit to receive an ice adaptation',
                    cardType: BattlefieldTypes,
                    controller: 'self',
                    cardCondition: (card, context) => card !== context.targets.fire,
                    gameAction: [
                        ability.actions.attachConjuredAlteration((context) => ({
                            conjuredAlteration: 'fire-adaptation',
                            target: context.targets.fire
                        })),
                        ability.actions.attachConjuredAlteration((context) => ({
                            conjuredAlteration: 'ice-adaptation',
                            target: context.targets.ice
                        }))
                    ]
                }
            }
        });
    }
}

ClashingTempers.id = 'clashing-tempers';

module.exports = ClashingTempers;
