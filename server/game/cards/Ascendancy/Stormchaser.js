const { Magic } = require('../../../constants.js');
const Card = require('../../Card.js');

class Stormchaser extends Card {
    setupCardAbilities(ability) {
        this.forcedReaction({
            title: 'Galewinds',
            when: {
                onAttackersDeclared: (event, context) => {
                    // I'm the attacker
                    return event.attackers.includes(context.source);
                }
            },
            gameAction: ability.actions.conditional({
                condition: (context) => context.player.actionSpellPlayed,
                trueGameAction: ability.actions.cardLastingEffect((context) => ({
                    duration: 'untilEndOfTurn',
                    effect: ability.effects.modifyAttack(2),
                    target: context.source
                }))
            }),
        });
    }
}

Stormchaser.id = 'stormchaser';

module.exports = Stormchaser;
