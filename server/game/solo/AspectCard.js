const AbilityDsl = require("../abilitydsl");
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

    canAttack() {
        return this.target && super.canAttack();
    }

    isConjuration() {
        return true;
    }

    defender() {
        this.persistentEffect({
            condition: () => !this.exhausted,

            effect: AbilityDsl.effects.defender()
        });
    }
}

module.exports = AspectCard;
