const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class CryptGuardian extends Card {
    setupCardAbilities(ability) {
        this.unitGuard();

        this.forcedInterrupt({
            autoResolve: true,
            title: 'Shackle 1',
            when: {
                onRoundEnded: () => true
            },
            target: {
                activePromptTitle: 'Choose a unit to exhaust',
                cardType: BattlefieldTypes,
                cardCondition: (card) => !card.exhausted,
                gameAction: ability.actions.exhaust()
            }
        });

        this.forcedInterrupt({
            when: {
                onCardDestroyed: (event, context) => event.card === context.source &&
                    !(event.damageEvent && event.damageEvent.fightEvent) && // not a fight
                    event.sourceType !== 'unit'
            },
            destroyed: true,
            target: {
                activePromptTitle: 'Choose a unit to exhaust',
                cardType: BattlefieldTypes,
                cardCondition: (card) => !card.exhausted,
                gameAction: ability.actions.exhaust()
            }
        });
    }
}

CryptGuardian.id = 'crypt-guardian';

module.exports = CryptGuardian;
