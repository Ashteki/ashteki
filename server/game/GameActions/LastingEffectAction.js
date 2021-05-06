const GameAction = require('./GameAction');
const Effects = require('../effects.js');

class LastingEffectAction extends GameAction {
    constructor(propertyFactory, duration = 2, durationType = 'turn') {
        super(propertyFactory);
        this.duration = this.duration || duration;
        this.durationType = this.durationType || durationType;
    }

    setDefaultProperties() {
        this.condition = null;
        this.effect = [];
        this.targetController =
            this.duration === 1 && this.durationType == 'turn' ? 'current' : 'opponent';
        this.until = null;
        this.when = null;
        this.gameAction = null;
        this.message = null;
        this.match = null;
        this.multipleTrigger = true;
    }

    setup() {
        super.setup();
        this.name = 'applyLastingEffect';
        this.effectMsg = 'apply a lasting effect';
    }

    hasLegalTarget(context) {
        this.update(context);
        return !!this.effect.length || (this.when && !!this.gameAction);
    }

    getEventArray(context) {
        if (this.when && this.gameAction) {
            this.effect = [
                Effects.lastingAbilityTrigger({
                    when: this.when,
                    gameAction: this.gameAction,
                    message: this.message,
                    messageArgs: this.messageArgs,
                    preferActionPromptMessage: this.preferActionPromptMessage,
                    multipleTrigger: this.multipleTrigger,
                    context: context,
                    triggeredAbilityType: this.triggeredAbilityType
                })
            ];
        }

        let properties = {
            condition: this.condition,
            context: context,
            effect: this.effect,
            match: this.match,
            targetController: this.when ? 'current' : this.targetController
        };
        if (this.until) {
            properties.until = this.until;
            return [
                super.createEvent('applyLastingEffect', { context: context }, (event) =>
                    event.context.source.lastingEffect(() => properties)
                )
            ];
        }
        if (this.durationType === 'round') {
            properties.roundDuration = this.duration;
        } else {
            properties.turnDuration = this.duration;
        }

        return [
            super.createEvent('applyLastingEffect', { context: context }, (event) =>
                this.durationType == 'round'
                    ? event.context.source.roundDurationEffect(properties)
                    : event.context.source.turnDurationEffect(properties)
            )
        ];
    }
}

module.exports = LastingEffectAction;
