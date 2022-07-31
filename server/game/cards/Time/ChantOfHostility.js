const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class ChantOfHostility extends Card {
    setupCardAbilities(ability) {
        this.forcedReaction({
            autoResolve: true,
            location: 'spellboard',
            when: {
                onCardDestroyed: (event, context) =>
                    event.card.type === 'Ally' && event.card.controller == context.player
            },
            condition: (context) => context.source.status == 0,
            gameAction: ability.actions.addStatusToken((context) => ({
                amount: 1,
                target: context.source
            }))
        });

        this.action({
            title: 'Hostility',
            location: 'spellboard',
            cost: [ability.costs.sideAction(), ability.costs.exhaust(), ability.costs.loseStatus()],
            target: {
                cardType: BattlefieldTypes,
                gameAction: ability.actions.cardLastingEffect(() => ({
                    duration: 'untilEndOfTurn',
                    effect: ability.effects.modifyAttack(1)
                }))
            }
        });
    }
}

ChantOfHostility.id = 'chant-of-hostility';

module.exports = ChantOfHostility;
