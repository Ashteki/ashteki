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

    statusAbility(properties) {
        return this.forcedReaction(
            Object.assign(
                {
                    status: true,
                    inexhaustible: true,
                    when: {
                        // it's my turn
                        onBeginTurn: (event, context) => event.player === context.player
                    },
                    location: 'play area',
                    cost: [AbilityDsl.costs.loseStatus(1)],
                    logUse: (context) =>
                        properties.log === 'each' ||
                        (properties.log === 'last' && context.source.status === 0)
                },
                properties
            )
        );
    }

    hordeAttack() {
        this.persistentEffect({
            effect: AbilityDsl.effects.hordeAttack()
        });
    }
    feeble() {
        this.persistentEffect({
            effect: AbilityDsl.effects.feeble()
        });
    }
}

module.exports = AspectCard;
