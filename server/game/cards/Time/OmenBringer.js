const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class OmenBringer extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            gameAction: ability.actions.filterDeck((context) => ({
                amount: 2,
                target: context.player.opponent
            }))
        });

        // Hasten
        this.forcedInterrupt({
            when: {
                onAttackersDeclared: (event, context) => {
                    return (
                        event.attackingPlayer === context.source.controller &&
                        event.attackers.includes(context.source) &&
                        context.source.status > 0
                    );
                }
            },
            target: {
                optional: true,
                activePromptTitle: 'Hasten: Choose a ready spell',
                cardType: CardType.ReadySpell,
                gameAction: ability.actions.removeExhaustion()
            },
            effect: 'remove an exhaustion from {0}'
        });
    }
}

OmenBringer.id = 'omen-bringer';

module.exports = OmenBringer;
