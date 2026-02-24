const SequentialDamagePrompt = require('../gamesteps/SequentialDamagePrompt');
const PlayerAction = require('./PlayerAction');

class SequentialDamageAction extends PlayerAction {
    setDefaultProperties() {
        this.damageStep = 1;
        this.numSteps = 0;
        this.controller = 'any';
    }

    getEvent(target, context) {
        return super.createEvent('unnamedevent', { context: context, player: target }, () => {
            context.game.queueStep(
                new SequentialDamagePrompt(context.game, {
                    choosingPlayer: this.choosingPlayer,
                    damageStep: this.damageStep,
                    numSteps: this.numSteps,
                    context: context,
                    cardType: this.cardType,
                    allowRepeats: this.allowRepeats
                })
            );
        });
    }

    canAffect() {
        return true;
    }
}

module.exports = SequentialDamageAction;
