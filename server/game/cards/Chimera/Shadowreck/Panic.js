const { Level } = require('../../../../constants');
const AspectCard = require('../../../solo/AspectCard');

class Panic extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.entersPlay({
            title: 'Panic',
            target: {
                toSelect: 'die',
                autoTarget: (context) =>
                    context.player.dice.filter((d) => d.level === Level.Basic).slice(0, 2),
                gameAction: ability.actions.rerollDice()
            },
            then: {
                target: {
                    activePromptTitle: 'Choose dice to lower',
                    player: 'opponent',
                    targetsPlayer: true,
                    toSelect: 'die',
                    mode: 'exactly',
                    numDice: (context) => this.getRerollCount(context),
                    dieCondition: (die) => !die.exhausted && die.level !== Level.Basic,
                    owner: 'opponent',
                    gameAction: ability.actions.lowerDie()
                }
            }
        });

        this.retreat();
    }

    getRerollCount(context) {
        const basicsRolled = context.preThenEvent.dice.filter(
            (d) => d.level === Level.Basic
        ).length;
        return Math.min(basicsRolled, this.owner.opponent.activeNonBasicDiceCount);
    }
}

Panic.id = 'panic';

module.exports = Panic;
