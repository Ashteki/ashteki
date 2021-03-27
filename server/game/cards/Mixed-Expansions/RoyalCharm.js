const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');

class RoyalCharm extends Card {
    setupCardAbilities() {
        this.forcedReaction({
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
                activePromptTitle: 'Place die on Royal Charm?',
                optional: true,
                toSelect: 'die',
                dieCondition: (die, context) => context.event.dice.includes(die),
                gameAction: this.game.actions.attachDie((context) => ({
                    target: context.source,
                    upgradeDie: context.target
                }))
            }
        });
    }
}

RoyalCharm.id = 'royal-charm';

module.exports = RoyalCharm;
