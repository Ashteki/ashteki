const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class StandardBearer extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            gameAction: ability.actions.addStatusToken((context) => ({
                amount: 1,
                target: context.source
            }))
        });

        this.forcedReaction({
            inexhaustible: true,
            title: 'Resourceful 1',
            autoResolve: true,
            when: {
                onPhaseStarted: (event) => event.phase === 'playerturns'
            },
            effect: 'gain 1 status token',
            gameAction: ability.actions.addStatusToken()
        });

        this.forcedReaction({
            title: 'Inspire 1',
            when: {
                onAttackersDeclared: (event, context) => {
                    // I'm the attacker
                    return event.battles.some((b) => b.attacker === context.source);
                }
            },
            target: {
                mode: 'upTo',
                numCards: (context) => context.source.status,
                optional: true,
                cardType: BattlefieldTypes,
                controller: 'self',
                cardCondition: (card, context) => card !== context.source && card.isAttacker,
                gameAction: ability.actions.cardLastingEffect({
                    duration: 'untilEndOfTurn',
                    effect: ability.effects.modifyAttack(1)
                })
            }
        });
    }
}

StandardBearer.id = 'standard-bearer';

module.exports = StandardBearer;
