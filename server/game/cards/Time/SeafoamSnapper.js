const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class SeafoamSnapper extends Card {
    setupCardAbilities(ability) {
        this.forcedInterrupt({
            title: 'Tough 1',
            when: {
                onDamageApplied: (event, context) =>
                    event.card === context.source && context.source.status > 0
            },
            gameAction: [
                ability.actions.removeStatus({ all: true }),
                ability.actions.preventDamage((context) => ({
                    event: context.event,
                    amount: this.getAbilityNumeric(1)
                }))
            ]
        });

        this.entersPlay({
            title: 'Hungry 1',
            effect: 'destroy {0}',
            target: {
                activePromptTitle: 'Choose a conjuration to destroy',
                cardType: CardType.Conjuration,
                controller: 'self',
                cardCondition: (card) => card.exhausted,
                gameAction: ability.actions.destroy()
            },
            then: {
                gameAction: ability.actions.addStatusToken((context) => ({
                    amount: 1,
                    target: context.source
                }))
            }
        });
    }
}

SeafoamSnapper.id = 'seafoam-snapper';

module.exports = SeafoamSnapper;
