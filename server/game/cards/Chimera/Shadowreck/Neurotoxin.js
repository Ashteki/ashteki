const AspectCard = require("../../../solo/AspectCard");

class Neurotoxin extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.statusAbility({
            log: 'each',
            target: {
                autoTarget: (context) => context.player.opponent.phoenixborn,
                gameAction: ability.actions.dealDamage({ showMessage: true })
            },
            then: {
                condition: (context) => context.source.status === 0,
                target: {
                    activePromptTitle: 'Choose a die to exhaust',
                    player: 'opponent',
                    targetsPlayer: true,
                    toSelect: 'die',
                    mode: 'exactly',
                    numDice: 1,
                    dieCondition: (die) => !die.exhausted,
                    owner: 'opponent',
                    gameAction: ability.actions.exhaustDie()
                },
                message: '{0} uses {1} to lower one opponent die'
            }
        });
    }
}

Neurotoxin.id = 'neurotoxin';

module.exports = Neurotoxin;
