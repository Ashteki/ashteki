const AspectCard = require('../../../solo/AspectCard');

class EntanglingArrow extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);
        this.forcedInterrupt({
            title: 'Tangle 2',
            when: {
                onAttackersDeclared: (event, context) => {
                    return (
                        event.attackingPlayer === context.source.controller &&
                        event.attackers.includes(context.source)
                    );
                }
            },
            condition: (context) => context.source.controller.opponent.activeNonBasicDiceCount > 0,
            target: {
                activePromptTitle: 'Choose dice to lower',
                player: 'opponent',
                targetsPlayer: true,
                toSelect: 'die',
                mode: 'exactly',
                numDice: (context) => this.getLowerCount(context),
                owner: 'opponent',
                gameAction: ability.actions.lowerDie()
            }
        });

        this.ephemeral();
    }

    getLowerCount(context) {
        return Math.min(2, this.owner.opponent.activeNonBasicDiceCount);
    }
}

EntanglingArrow.id = 'entangling-arrow';

module.exports = EntanglingArrow;
