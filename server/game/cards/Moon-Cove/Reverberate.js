const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Reverberate extends Card {
    getTargetData = (ability, context, remainingPings) => {
        const remainder = remainingPings !== undefined ? remainingPings : this.getDamageAmount(context);
        if (remainder === 0) {
            return {
                alwaysTriggers: true,
                gameAction: ability.actions.draw()
            };
        }
        let returnValue = {
            target: {
                optional: true,
                activePromptTitle: 'Choose a target to deal 1 damage to',
                cardType: BattlefieldTypes,
                controller: 'opponent',
                gameAction: ability.actions.dealDamage()
            }
        };
        if (remainder === undefined) {
            returnValue.then = (context) =>
                this.getTargetData(ability, context, this.getDamageAmount(context) - 1);
        } else {
            returnValue.then = (context) =>
                this.getTargetData(ability, context, remainder - 1);
        }
        return returnValue;
    };

    getDamageAmount = (context) => {
        const count = context.player.discard.filter((c) => c.id === 'reverberate').length;
        return count;
    };

    setupCardAbilities(ability) {
        this.play({
            target: {
                optional: true,
                activePromptTitle: 'Choose a target to deal 1 damage to',
                cardType: BattlefieldTypes,
                controller: 'opponent',
                gameAction: ability.actions.dealDamage()
            },
            then: {
                gameAction: ability.actions.sequentialForEach((context) => ({
                    num: this.getDamageAmount(context),
                    action: ability.actions.dealDamage({
                        promptForSelect: {
                            activePromptTitle: 'Choose a unit to deal 1 damage to',
                            optional: true,
                            cardType: BattlefieldTypes,
                            controller: 'opponent'
                        }
                    })
                })),
                then: {
                    alwaysTriggers: true,
                    gameAction: ability.actions.draw()
                }
            }
        });
    }
}

Reverberate.id = 'reverberate';

module.exports = Reverberate;
