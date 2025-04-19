const AspectCard = require('../../../solo/AspectCard');

class WitheringRot extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.statusAbility({
            log: 'each',
            target: {
                toSelect: 'player',
                ignoreTargetCheck: true,
                autoTarget: (context) => context.player.opponent,
                gameAction: ability.actions.chooseAction((context) => ({
                    target: context.target,
                    player: context.target,
                    choices: {
                        Discard: ability.actions.chosenDiscard(),
                        '1 Pb Damage': ability.actions.dealDamage((context) => ({
                            target: context.player.opponent.phoenixborn,
                            amount: 1,
                            showMessage: true
                        }))
                    }
                }))
            }
        });
    }
}

WitheringRot.id = 'withering-rot';

module.exports = WitheringRot;
