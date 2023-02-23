const { Level } = require("../../../constants");
const AspectCard = require("../../solo/AspectCard");

class IronScales extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);
        this.interrupt({
            title: 'Iron Scales',
            when: {
                onDamageApplied: (event, context) => event.card === context.source
                    && context.event.amount > 1
            },
            effect: 'prevent all but one damage',
            gameAction: ability.actions.preventDamage((context) => ({
                event: context.event,
                amount: 'all'
            }))
        });

        this.defender()
    }
}

IronScales.id = 'iron-scales';

module.exports = IronScales