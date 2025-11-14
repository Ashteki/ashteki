const { Level, Magic, CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class Reimagine extends Card {
    setupCardAbilities(ability) {
        this.forcedReaction({
            when: {
                onDiePowerSpent: (event, context) =>
                    event.player === context.player &&
                    event.die.level === Level.Power &&
                    [Magic.Time, Magic.Illusion].includes(event.die.magic) &&
                    context.source.dieUpgrades.length === 0
            },
            title: 'Reimagine',
            location: 'spellboard',
            may: () => 'place the used die on Reimagine',
            condition: (context) => !context.event.die.parent,
            gameAction: [
                ability.actions.attachDie((context) => ({
                    target: context.source,
                    upgradeDie: context.event.die
                })),
                ability.actions.exhaust()
            ]
        });

        this.forcedInterrupt({
            title: 'Reimagine',
            when: {
                onRoundEnded: () => this.dieUpgrades
            },
            // may: 'return dice to your exhausted pool',
            gameAction: ability.actions.detachDie((context) => ({
                die: context.source.dieUpgrades
            }))
        });

        this.persistentEffect({
            effect: ability.effects.preventAutoDice()
        });
    }

    canSpendDieUpgrades(context) {
        return context.source?.type === CardType.ReactionSpell || context.playedAsReaction;
    }
}

Reimagine.id = 'reimagine';

module.exports = Reimagine;
