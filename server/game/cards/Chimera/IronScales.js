const AspectCard = require('../../solo/AspectCard');

class IronScales extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.forcedInterrupt({
            autoResolve: true,
            inexhaustible: true,
            when: {
                onDamageApplied: (event, context) => event.card === context.source
            },
            gameAction: ability.actions.preventDamage((context) => ({
                event: context.event,
                amount: context.event.amount - 1
            }))
        });
        this.defender();
    }
}

IronScales.id = 'iron-scales';

module.exports = IronScales;
