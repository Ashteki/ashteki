const { BattlefieldTypes, CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class AshSpirit extends Card {
    setupCardAbilities(ability) {
        this.afterDestroyedDefending({
            title: 'To Ash',
            autoResolve: true,
            target: {
                cardType: BattlefieldTypes,
                autoTarget: (context) => context.event.triggeringEvent.damageEvent.damageSource,
                gameAction: ability.actions.destroy()
            }
        });

        this.forcedInterrupt({
            autoResolve: true,
            title: 'Smolder 1',
            when: {
                onRoundEnded: () => true
            },
            target: {
                cardType: CardType.Phoenixborn,
                cardCondition: (card) => card.controller.deck.length === 0,
                gameAction: ability.actions.dealDamage()
            }
        });
    }
}

AshSpirit.id = 'ash-spirit';

module.exports = AshSpirit;
