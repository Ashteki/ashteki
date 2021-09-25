const DiceGameAction = require('./DiceGameAction');

class ExhaustDieAction extends DiceGameAction {
    setDefaultProperties() {
        this.showMessage = false;
    }

    setup() {
        this.name = 'exhaustDie';
        this.effectMsg = 'exhaust die {0}';
        this.targetType = ['die'];
    }

    checkEventCondition(event) {
        return !event.die.exhausted && super.checkEventCondition(event);
    }

    getEvent(die, context) {
        return super.createEvent('onDieExhausted', { die: die, context: context }, () => {
            die.exhaust();

            if (this.showMessage) {
                context.game.addMessage(
                    "{0} exhausts {1} from {2}'s dice pool",
                    context.player,
                    die,
                    die.owner
                );
            }
        });
    }
}

module.exports = ExhaustDieAction;
