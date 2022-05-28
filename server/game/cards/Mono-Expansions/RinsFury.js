const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class RinsFury extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onDamageApplied: (event, context) =>
                    event.damageEvent.context.player === context.player.opponent &&
                    BattlefieldTypes.includes(event.damageEvent.card.type) &&
                    event.damageEvent.fightEvent &&
                    event.damageEvent.damageSource.owner === context.player.opponent
            },
            gameAction: ability.actions.preventDamage((context) => ({
                event: context.event,
                amount: 'all'
            })),
            then: (context) => ({
                alwaysTriggers: true,
                target: {
                    cardType: BattlefieldTypes,
                    autoTarget: () => context.event.damageEvent.damageSource,
                    controller: 'opponent',
                    gameAction: ability.actions.destroy()
                }
            })
        });
    }
}

RinsFury.id = 'rins-fury';

module.exports = RinsFury;
