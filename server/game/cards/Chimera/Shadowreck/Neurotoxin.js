const { Level } = require('../../../../constants');
const AspectCard = require("../../../solo/AspectCard");

class Neurotoxin extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.statusAbility({
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
                    numDice: (context) => Math.min(1, this.owner.opponent.activeNonBasicDiceCount),
                    dieCondition: (die) => !die.exhausted && die.level !== Level.Basic,
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
