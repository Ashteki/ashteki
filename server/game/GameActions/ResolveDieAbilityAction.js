const { NoCostsAbilityResolver } = require('../gamesteps/NoCostsAbilityResolver');
const DiceGameAction = require('./DiceGameAction');

class ResolveDieAbilityAction extends DiceGameAction {
    setDefaultProperties() { }

    setup() {
        super.setup();
        this.name = 'resolveDie';
    }

    getEvent(die, context) {
        return super.createEvent('onAction', { die: die, context: context }, (event) => {
            const ability = event.die.getPowerDieAction();
            context.game.queueSimpleStep(() => {
                if (ability) {
                    let newContext = Object.assign(ability.createContext(context.player), {
                        isResolveAbility: true
                    });
                    context.game.queueStep(new NoCostsAbilityResolver(context.game, newContext));
                }
            });
        });
    }
}

module.exports = ResolveDieAbilityAction;
