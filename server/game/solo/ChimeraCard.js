const AbilityDsl = require("../abilitydsl");
const Card = require("../Card");

class ChimeraCard extends Card {
    setupCardAbilities(ability) {
        this.forcedReaction({
            when: {
                onAddToken: (event, context) => event.type === 'redRains'
                    && event.card === context.source
                    && event.card.redRains >= event.card.ultimate
            },
            gameAction: ability.actions.triggerUltimate()
        })
    }
}

module.exports = ChimeraCard;
