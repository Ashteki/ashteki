const AspectCard = require('../../../solo/AspectCard');

class WitheringRot extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.statusAbility({
            target: {
                toSelect: 'player',
                ignoreTargetCheck: true,
                autoTarget: (context) => context.player.opponent,
                gameAction: ability.actions.conditional({
                    condition: (context) => context.source.status === 0,
                    trueGameAction: ability.actions.chooseAction((context) => ({
                        target: context.target,
                        player: context.target,
                        choices: {
                            Discard: ability.actions.chosenDiscard(),

                            // ability.actions.conditional({
                            //     condition: (context) => context.target.controller.getHand().length > 0,
                            //     trueGameAction: ability.actions.discardAtRandom({
                            //         target: context.target.controller
                            //     }),
                            //     falseGameAction: ability.actions.addDamageToken({
                            //         amount: 2,
                            //         showMessage: true
                            //     })
                            // }),
                            '1 Pb Damage': ability.actions.dealDamage((context) => ({
                                target: context.player.opponent.phoenixborn,
                                amount: 1,
                                showMessage: true
                            }))
                        }
                    }))
                })
            }
        });
    }

    get statusCount() {
        return 3;
    }
}

WitheringRot.id = 'withering-rot';

module.exports = WitheringRot;
