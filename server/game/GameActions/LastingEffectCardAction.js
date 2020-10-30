const CardGameAction = require('./CardGameAction');

class LastingEffectCardAction extends CardGameAction {
    constructor(propertyFactory, duration = 2, durationType = 'turn') {
        super(propertyFactory);
        this.duration = this.duration || duration;
        this.durationType = this.durationType || durationType;
    }

    setDefaultProperties() {
        this.condition = null;
        this.until = null;
        this.effect = [];
        this.targetLocation = null;
        this.targetController =
            this.duration === 1 && this.durationType == 'turn' ? 'current' : 'opponent';
    }

    setup() {
        super.setup();
        this.name = 'applyLastingEffect';
        this.effectMsg = 'apply a lasting effect to {0}';
    }

    update(context) {
        super.update(context);
        let effect = this.effect;
        if (!Array.isArray(effect)) {
            effect = [effect];
        }

        let effectProperties = {
            condition: this.condition,
            context: context,
            duration: this.duration,
            targetLocation: this.targetLocation,
            until: this.until
        };

        if (this.durationType === 'round') {
            effectProperties.roundDuration = this.duration;
        } else {
            effectProperties.turnDuration = this.duration;
        }
        this.effect = effect.map((factory) =>
            factory(context.game, context.source, effectProperties)
        );
    }

    canAffect(card, context) {
        if (
            (card.location !== 'play area' || card.location === 'spellboard') &&
            !this.targetLocation
        ) {
            return false;
        }

        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        let { effect } = this.propertyFactory(context);
        let properties = {
            condition: this.condition,
            context: context,
            effect: effect,
            match: card,
            targetLocation: this.targetLocation,
            until: this.until,
            durationType: this.durationType
        };

        if (this.durationType === 'round') {
            properties.roundDuration = this.duration;
        } else {
            properties.turnDuration = this.duration;
        }

        const methodFromDuration =
            this.durationType == 'round' ? 'roundDurationEffect' : 'turnDurationEffect';
        let methodName = this.until ? 'lastingEffect' : methodFromDuration;

        return super.createEvent('onEffectApplied', { card: card, context: context }, (event) =>
            event.context.source[methodName](properties)
        );
    }
}

module.exports = LastingEffectCardAction;
