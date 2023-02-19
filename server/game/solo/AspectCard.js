const Card = require("../Card");

class AspectCard extends Card {
    setupCardAbilities(ability) {
        this.alert();

        this.destroyedOrDiscarded({
            inexhaustible: true,
            target: {
                autoTarget: () => this.owner.phoenixborn,
                gameAction: ability.actions.dealDamage((context) => ({
                    amount: context.source.blood,
                    showMessage: true
                }))
            },
            preferActionPromptMessage: true
        });
    }
}

module.exports = AspectCard;
