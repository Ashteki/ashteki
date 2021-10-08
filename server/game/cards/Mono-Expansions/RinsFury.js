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
            },
            gameAction: ability.actions.preventDamage((context) => ({
                event: context.event,
                amount: 'all'
            })),
            then: (context) => ({
                alwaysTriggers: true,
                target: {
                    cardType: BattlefieldTypes,
                    autoTarget: () => context.event.damageSource,
                    gameAction: ability.actions.destroy()
                }
            })
        });
    }
}

RinsFury.id = 'rins-fury';

module.exports = RinsFury;
