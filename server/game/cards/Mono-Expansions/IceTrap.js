const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class IceTrap extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    BattlefieldTypes.includes(event.card.type) &&
                    event.card.life <= 2 &&
                    !event.card.anyEffect('cannotBeSpellTarget') &&
                    !event.card.anyEffect('cannotBeReactionTarget')
            },
            target: {
                autoTarget: (context) => context.event.card,
                gameAction: ability.actions.destroy()
            }
        });
    }
}

IceTrap.id = 'ice-trap';

module.exports = IceTrap;
