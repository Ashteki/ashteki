const AspectCard = require('../../../solo/AspectCard');

class BonechillWind extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.forcedReaction({
            inexhaustible: true,
            when: {
                // it's my turn
                onBeginTurn: (event, context) => event.player === context.player
            },
            location: 'play area',
            cost: [ability.costs.loseStatus(1)],
            target: {
                ignoreTargetCheck: true,
                autoTarget: (context) => this.getExhaustedTargets(context),
                gameAction: ability.actions.dealDamage({ showMessage: true })
            }
            //            effect: 'reroll all basic dice'
        });
    }

    getExhaustedTargets(context) {
        const result = [...context.player.opponent.unitsInPlay.filter((u) => u.exhausted)];

        if (context.player.opponent.phoenixborn.exhausted) {
            result.push(context.player.opponent.phoenixborn);
        }

        return result;
    }

    get statusCount() {
        return 2;
    }
}

BonechillWind.id = 'bonechill-wind';

module.exports = BonechillWind;
