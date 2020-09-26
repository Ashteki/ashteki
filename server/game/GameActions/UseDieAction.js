const DiceGameAction = require('./DiceGameAction');

class UseDieAction extends DiceGameAction {
    setDefaultProperties() {
        this.ignoreHouse = true;
    }

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
            { die: die, context: context, ignoreHouse: this.ignoreHouse },
            (event) => die.use(context.player, event.ignoreHouse)
        );
    }
}

module.exports = UseDieAction;
