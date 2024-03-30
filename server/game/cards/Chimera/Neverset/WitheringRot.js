const AspectCard = require('../../../solo/AspectCard');

class WitheringRot extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.statusAbility({
            target: {
                toSelect: 'player',
                autoTarget: (context) => context.player.opponent,
                gameAction: ability.actions.conditional({
                    condition: (context) => context.source.status === 0,
                    trueGameAction: ability.actions.chosenDiscard({

                    })
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
