const AbilityContext = require('../AbilityContext');
const BaseAbility = require('../baseability');

class ExhaustDieAbility extends BaseAbility {
    constructor(die, costs = []) {
        let properties = { cost: costs };
        super(properties);

        this.die = die;
        this.title = 'Exhaust this Die';
    }

    createContext(player = this.die.owner) {
        return new AbilityContext({
            ability: this,
            game: this.die.game,
            player: player,
            source: this.die
        });
    }

    executeHandler(context) {
        context.game.actions.exhaustDie().resolve(this.die, context);
    }

    displayMessage(context) {
        context.game.addMessage('{0} exhausts a die', context.player, context.source);
    }

    meetsRequirements(context = this.createContext(), ignoredRequirements = []) {
        if (
            //todo: bit of a guess here - assuming there's a 'cannot exhaust dice type thing'
            !ignoredRequirements.includes('cannotTrigger') &&
            (!context.player.checkRestrictions('use', context) ||
                !context.source.checkRestrictions('use', context))
        ) {
            return 'cannotTrigger';
        }

        return super.meetsRequirements(context);
    }

    // todo: needed?
    // eslint-disable-next-line no-unused-vars
    addSubEvent(event, context) {
        return;
    }

    isAction() {
        return true;
    }
}

module.exports = ExhaustDieAbility;
