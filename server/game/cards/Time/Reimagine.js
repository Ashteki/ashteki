const { Level, Magic } = require('../../../constants.js');
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
            gameAction: [
                ability.actions.attachDie((context) => ({
                    target: context.source,
                    upgradeDie: context.event.die
                })),
                ability.actions.exhaust()
            ]
        });

        this.persistentEffect({
            effect: ability.effects.preventAutoDice()
        });
    }

    get canSpendDieUpgrades() {
        return true;
    }
}

Reimagine.id = 'reimagine';

module.exports = Reimagine;
