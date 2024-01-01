const { Level } = require('../../../../constants');
const AbilityDsl = require('../../../abilitydsl');
const AspectCard = require('../../../solo/AspectCard');

class Galeforce extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.statusAbility({
            target: {
                activePromptTitle: 'Choose a die to lower one level',
                player: 'opponent',
                targetsPlayer: true,
                toSelect: 'die',
                mode: 'exactly',
                numDice: 1,
                dieCondition: (die) => !die.exhausted && die.level !== Level.Basic,
                owner: 'opponent',
                gameAction: AbilityDsl.actions.lowerDie()
            }
        });
    };

    get statusCount() {
        return 3;
    }
}

Galeforce.id = 'galeforce';

module.exports = Galeforce;
