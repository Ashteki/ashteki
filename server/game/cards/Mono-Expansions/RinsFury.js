const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class RinsFury extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onDamageDealt: (event, context) =>
                    event.context.player === context.player.opponent &&
                    BattlefieldTypes.includes(event.card.type) &&
                    event.fightEvent &&
                    event.damageSource.owner === context.player.opponent
                // check the fightevent is from a unit?
                // check it's my unit being damaged
            },
            gameAction: ability.actions.preventDamage((context) => ({
                event: context.event,
                amount: 'all'
            })),
            then: (context) => ({
                gameAction: ability.actions.destroy({
                    target: context.event.damageSource
                })
            })
        });
    }
}

RinsFury.id = 'rins-fury';

module.exports = RinsFury;
