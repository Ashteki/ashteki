const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class ConsumeSoul extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event, context) =>
                    event.clone.controller == context.player.opponent && // opponent controls
                    BattlefieldTypes.includes(event.card.type) && // a unit
                    event.damageEvent && // defensive for the attack test
                    event.damageEvent.fightEvent && // its an attack
                    event.damageEvent.fightEvent.attacker.controller === context.player // I attacked
            },
            gameAction: [
                ability.actions.removeDamage((context) => ({
                    target: context.player.phoenixborn,
                    amount: 2
                })),
                ability.actions.removeExhaustion((context) => ({
                    target: context.player.phoenixborn,
                    showMessage: true
                }))
            ]
        });
    }
}

ConsumeSoul.id = 'consume-soul';

module.exports = ConsumeSoul;
