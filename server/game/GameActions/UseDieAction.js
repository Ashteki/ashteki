const DiceGameAction = require('./DiceGameAction');

class UseDieAction extends DiceGameAction {
    constructor(propertyFactory) {
        super(propertyFactory);
        this.ignoreActionCost = false;
        this.ignoreAllCost = false;
    }

    setDefaultProperties() { }

    setup() {
        this.name = 'use';
        this.targetType = ['die'];
        this.effectMsg = 'use {0}';
    }

    canAffect(die, context) {
        return die !== context.source && super.canAffect(die, context);
    }

    getEvent(die, context) {
        return super.createEvent('onUseDie', { die: die, context: context }, () =>
            die.use(context.player, this.getIgnoredRequirements())
        );
    }

    getIgnoredRequirements() {
        const ignores = ['location'];
        if (this.ignoreActionCost) {
            ignores.push('actionCost');
        }
        if (this.ignoreAllCost) {
            ignores.push('allCost');
        }
        return ignores;
    }
}

module.exports = UseDieAction;
