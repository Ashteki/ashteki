const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class SeafoamSnapper extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => !this.exhausted && this.status > 0,
            effect: ability.effects.modifyArmor(() => this.getAbilityNumeric(1))
        });
        this.forcedInterrupt({
            when: {
                onDamagePreventedByArmor: (event, context) => event.card === context.source
            },
            gameAction: ability.actions.removeStatus({ all: true })
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
