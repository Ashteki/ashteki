const AbilityDsl = require('../../../abilitydsl');
const AspectCard = require('../../../solo/AspectCard');

class Avalanche extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.afterDestroysFighting({
            autoResolve: true,
            target: {
                activePromptTitle: 'Choose a die to exhaust',
                player: 'opponent',
                targetsPlayer: true,
                toSelect: 'die',
                mode: 'exactly',
                numDice: 1,
                dieCondition: (die) => !die.exhausted,
                owner: 'opponent',
                gameAction: AbilityDsl.actions.exhaustDie()
            }
        });
    }
}

Avalanche.id = 'avalanche';

module.exports = Avalanche;
