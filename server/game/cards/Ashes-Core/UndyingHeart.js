const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class UndyingHeart extends Card {
    setupCardAbilities(ability) {
        this.forcedInterrupt({
            autoResolve: true,
            inexhaustible: true,
            when: {
                onCardLeavesPlay: (event, context) =>
                    event.triggeringEvent.name === 'onCardDestroyed' &&
                    event.card === context.source.parent
            },
            condition: (context) => context.source.parent.type === CardType.Ally,
            targetController: 'any',
            may: (context) => 'return ' + context.source.parent.name + ' to hand',
            gameAction: ability.actions.changeEvent((context) => ({
                event: context.event,
                destination: 'hand',
                cancel: false
            })),
            effect: 'return {1} to hand',
            effectArgs: (context) => context.source.parent
        });

        this.whileAttached({
            inexhaustible: true,
            effect: [ability.effects.modifyLife(1), ability.effects.modifyRecover(1)]
        });
    }
}

UndyingHeart.id = 'undying-heart';

module.exports = UndyingHeart;
