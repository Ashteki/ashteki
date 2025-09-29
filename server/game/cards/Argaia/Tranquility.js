const { PhoenixbornTypes } = require('../../../constants');
const Card = require('../../Card.js');

class Tranquility extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.playerCannot('spendSide')
        });

        this.forcedInterrupt({
            autoResolve: true,
            title: 'Tranquility',
            when: {
                onTurnEnded: (event, context) => event.player === context.player
            },
            gameAction: ability.actions.addStatusToken(),
            then: {
                gameAction: ability.actions.conditional({
                    condition: (context) => context.source.status > 2,
                    trueGameAction: ability.actions.purge({ showMessage: true })
                })
            }
        });
    }

    canAttach(card, context) {
        return card && PhoenixbornTypes.includes(card.getType()) && this.canPlayAsUpgrade();
    }

    autoTarget(context) {
        return context.player.opponent.phoenixborn;
    }
}

Tranquility.id = 'tranquility';

module.exports = Tranquility;
