const DiceGameAction = require('./DiceGameAction');

class UseDieAction extends DiceGameAction {
    setDefaultProperties() {}

    setup() {
        this.name = 'use';
        this.targetType = ['power'];
        this.effectMsg = 'use {0}';
    }

    canAffect(die, context) {
        return die !== context.source && super.canAffect(die, context);
    }

    getEvent(die, context) {
        return super.createEvent(
            'onUseDie',
            { die: die, context: context },
            die.use(context.player)
        );
    }
}

module.exports = UseDieAction;
