const AspectCard = require('../../../solo/AspectCard');

class DragonRage extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.forcedReaction({
            when: {
                onAttackersDeclared: (event, context) => {
                    return event.attackers.includes(context.source);
                }
            },
            target: {
                autoTarget: (context) => context.player.phoenixborn,
                gameAction: ability.actions.addStatusToken()
            }
        });
    }
}

DragonRage.id = 'dragon-rage';

module.exports = DragonRage;
