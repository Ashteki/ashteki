const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class MoonsBlessing extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [ability.effects.modifyLife(1), ability.effects.modifyRecover(1)]
        });

        this.forcedReaction({
            when: {
                onCardAttached: (event, context) =>
                    event.card === context.source
                //  &&
                //     event.parent.controller === context.player
            },
            autoResolve: true,
            target: {
                activePromptTitle: 'Choose a ready spell to place in your hand',
                optional: true,
                controller: 'self',
                location: 'discard',
                cardType: CardType.ReadySpell,
                gameAction: ability.actions.returnToHand({
                    location: 'discard',
                    showMessage: true
                })
            }
        });
    }
}

MoonsBlessing.id = 'moons-blessing';

module.exports = MoonsBlessing;
