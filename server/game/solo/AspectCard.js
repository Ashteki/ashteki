const AbilityDsl = require("../abilitydsl");
const Card = require("../Card");

class AspectCard extends Card {
    setupCardAbilities(ability) {
        this.alert();

        this.destroyedOrDiscarded({
            inexhaustible: true,
            target: {
                autoTarget: () => this.owner.phoenixborn,
                gameAction: ability.actions.addDamageToken((context) => ({
                    amount: context.source.blood,
                    showMessage: true,
                    shortMessage: true
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
    ephemeral() {
        this.forcedReaction({
            title: 'Ephemeral',
            inexhaustible: true,
            when: {
                onCardExhausted: (event, context) => event.card === context.source
            },
            gameAction: AbilityDsl.actions.destroy({ showMessage: false }),
            message: 'Ephemeral: {0} is destroyed',
            messageArgs: (context) => context.source
        });
    }
    retreat() {
        this.forcedInterrupt({
            autoResolve: true,
            title: 'Retreat',
            when: {
                onRoundEnded: () => true
            },
            gameAction: AbilityDsl.actions.retreatAspect()
        });
    }
}

module.exports = AspectCard;
