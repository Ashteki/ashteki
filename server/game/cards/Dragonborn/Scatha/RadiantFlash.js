const { Level } = require('../../../../constants');
const AspectCard = require('../../../solo/AspectCard');

class RadiantFlash extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.entersPlay({
            target: {
                activePromptTitle: 'Choose a die to lower two levels',
                player: 'opponent',
                targetsPlayer: true,
                toSelect: 'die',
                mode: 'exactly',
                numDice: 1,
                dieCondition: (die) => !die.exhausted && die.level === Level.Power,
                owner: 'opponent',
                gameAction: ability.actions.setDieLevel({ level: 'basic' })
            },
            then: {
                alwaysTriggers: true,
                condition: (context) => !context.preThenEvent?.context.diceChangeCount,
                gameAction: ability.actions.addStatusToken((context) => ({
                    target: context.player.phoenixborn,
                    showMessage: true
                }))
            }
        });
    }
}

RadiantFlash.id = 'radiant-flash';

module.exports = RadiantFlash;
