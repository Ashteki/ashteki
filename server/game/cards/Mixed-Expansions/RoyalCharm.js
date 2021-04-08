const { Level, Magic, BattlefieldTypes } = require('../../../constants.js');
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

        this.action({
            title: 'Use Die',
            condition: (context) => context.source.dieUpgrades.length > 0,
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            targets: {
                die: {
                    toSelect: 'die',
                    from: (context) => context.source.dieUpgrades
                },
                host: {
                    dependsOn: 'die',
                    cardType: BattlefieldTypes,
                    cardCondition: (card, context) =>
                        !card.dieUpgrades.some((d) => d.magic === context.targets.die.magic),
                    gameAction: this.game.actions.attachDie((context) => ({
                        upgradeDie: context.targets.die
                    }))
                }
            }
        });
    }

    getUseActionChoices(card) {
        let result = {};
        card.dieUpgrades.forEach((d) => {
            result[d.magic] = () => true;
        });

        return result;
    }
}

RoyalCharm.id = 'royal-charm';

module.exports = RoyalCharm;
