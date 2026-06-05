const { Level } = require('../../../../constants');
const AbilityDsl = require('../../../abilitydsl');
const AspectCard = require('../../../solo/AspectCard');

class Galeforce extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.statusAbility({
            log: 'each',
            ignoreTargetCheck: true,
            target: {
                activePromptTitle: 'Choose a die to lower one level',
                player: 'opponent',
                targetsPlayer: true,
                toSelect: 'die',
                mode: 'exactly',
                numDice: 1,
                owner: 'opponent',
                gameAction: AbilityDsl.actions.lowerDie()
            }
        });
    };
}

Galeforce.id = 'galeforce';

module.exports = Galeforce;
