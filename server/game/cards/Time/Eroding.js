const Card = require('../../Card.js');
// const { BattlefieldTypes } = require('../../../constants.js');

class Eroding extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [ability.effects.modifyAttack(-1), ability.effects.modifyRecover(-1)]
        });

        this.forcedInterrupt({
            autoResolve: true,
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

        // this.action({
        //     inexhaustible: true,
        //     title: 'Spark',
        //     cost: [ability.costs.mainAction()],
        //     gameAction: ability.actions.discard({ target: this }),
        //     then: {
        //         target: {
        //             cardType: BattlefieldTypes,
        //             controller: 'any',
        //             gameAction: ability.actions.dealDamage({ showMessage: true }),
        //         }
        //     }
        // });
    }
}

Eroding.id = 'eroding';

module.exports = Eroding;
