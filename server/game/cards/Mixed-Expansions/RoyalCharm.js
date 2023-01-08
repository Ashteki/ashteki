const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');

class RoyalCharm extends Card {
    setupCardAbilities(ability) {
        this.forcedReaction({
            autoResolve: true,
            when: {
                onDiceSpent: (event, context) =>
                    event.player === context.player &&
                    event.dice.some(
                        (d) =>
                            d.level === Level.Power && [Magic.Charm, Magic.Divine].includes(d.magic)
                    ) &&
                    context.source.dieUpgrades.length === 0
            },
            title: 'Royal Charm',
            location: 'spellboard',
            target: {
                activePromptTitle: 'Choose exhausted power die to place on Royal Charm',
                waitingPromptTitle: 'Waiting for opponent to choose a die to place on Royal Charm',
                optional: true,
                toSelect: 'die',
                dieCondition: (die, context) =>
                    context.event.dice.includes(die) &&
                    die.level === Level.Power &&
                    [Magic.Charm, Magic.Divine].includes(die.magic),
                gameAction: this.game.actions.attachDie((context) => ({
                    target: context.source,
                    upgradeDie: context.target
                }))
            }
        });

        this.action({
            title: 'Use Die',
            condition: (context) => context.source.dieUpgrades.length > 0,
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            target: {
                toSelect: 'die',
                activePromptTitle: 'Choose which die on Royal Charm to resolve',
                from: (context) => context.source.dieUpgrades,
                gameAction: this.game.actions.resolveDieAbility()
            }
        });

        this.persistentEffect({
            effect: ability.effects.preventAutoDice()
        });
    }
}

RoyalCharm.id = 'royal-charm';

module.exports = RoyalCharm;
