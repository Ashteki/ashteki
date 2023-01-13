const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');
const { checkTarget } = require('../../targetting.js');

class IceTrap extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    (event.context.player === context.player.opponent ||
                        !context.player.optionSettings.dontIceTrapOwnUnits) &&
                    BattlefieldTypes.includes(event.card.type) &&
                    event.card.life <= 2 &&
                    checkTarget(event.card, context)
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
