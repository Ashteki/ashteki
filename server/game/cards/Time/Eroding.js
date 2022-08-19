const Card = require('../../Card.js');
// const { BattlefieldTypes } = require('../../../constants.js');

class Eroding extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [ability.effects.modifyAttack(-1), ability.effects.modifyRecover(-1)]
        });

        this.forcedInterrupt({
            inexhaustible: true,
            when: {
                onRoundEnded: () => true
            },
            gameAction: [
                ability.actions.dealDamage((context) => ({
                    target: context.source.parent
                })),
                ability.actions.discard((context) => ({
                    card: context.source
                }))
            ]
        });
    }
}

Eroding.id = 'eroding';

module.exports = Eroding;
