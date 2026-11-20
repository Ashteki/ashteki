const { Magic } = require('../../../constants.js');
const Card = require('../../Card.js');

class Ethersight extends Card {
    setupCardAbilities(ability) {
        this.entersSpellboard({
            location: 'spellboard',
            condition: (context) => !context.player.phoenixborn.isAirborne,
            target: {
                toSelect: 'die',
                autoTarget: (context) =>
                    context.player.findDie((die) => die.magic === Magic.Astral && die.exhausted),
                gameAction: ability.actions.resolveDieAbility((context) => ({
                    targetCard: context.player.phoenixborn
                }))
            }
        });

        this.forcedReaction({
            when: {
                // it's my turn
                onBeginTurn: (event, context) => event.player === context.player
            },
            location: 'spellboard',
            condition: (context) => context.player.phoenixborn.isAirborne,
            target: {
                activePromptTitle: 'Choose a die to lower one level',
                optional: true,
                targetsPlayer: true,
                toSelect: 'die',
                mode: 'upTo',
                numDice: 1,
                gameAction: ability.actions.lowerDie()
            },
            message: '{0} uses {1} to lower 1 player die'
        });
    }
}

Ethersight.id = 'ethersight';

module.exports = Ethersight;
