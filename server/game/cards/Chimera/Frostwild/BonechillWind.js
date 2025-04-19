const AspectCard = require('../../../solo/AspectCard');

class BonechillWind extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.statusAbility({
            log: 'each',
            target: {
                ignoreTargetCheck: true,
                autoTarget: (context) => this.getExhaustedTargets(context),
                gameAction: ability.actions.dealDamage({ showMessage: true })
            }
        });
    }

    getExhaustedTargets(context) {
        const result = [...context.player.opponent.unitsInPlay.filter((u) => u.exhausted)];

        if (context.player.opponent.phoenixborn.exhausted) {
            result.push(context.player.opponent.phoenixborn);
        }

        return result;
    }
}

BonechillWind.id = 'bonechill-wind';

module.exports = BonechillWind;
