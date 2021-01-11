const ThenAbility = require('../ThenAbility');

class DieAbility extends ThenAbility {
    constructor(die, properties) {
        super(die.game, die, properties);
        this.die = die;
        this.title = properties.title ? properties.title : 'Power Ability';
    }

    meetsRequirements(context = this.createContext(), ignoredRequirements = []) {
        if (
            //todo: bit of a guess here - assuming there's a 'cannot exhaust dice type thing' ?
            !ignoredRequirements.includes('cannotTrigger') &&
            (!context.player.checkRestrictions('use', context) ||
                !context.source.checkRestrictions('use', context))
        ) {
            return 'cannotTrigger';
        }

        return super.meetsRequirements(context);
    }

    // executeGameActions(actions, context) {
    //     // Get any gameActions for this ability
    //     // Get their events, and execute simultaneously
    //     let events = actions.reduce(
    //         (array, action) => array.concat(action.getEventArray(context)),
    //         []
    //     );
    //     let then = this.properties.then;
    //     if (then && typeof then === 'function') {
    //         then = then(context);
    //     }

    //     if (events.length > 0) {
    //         this.game.openEventWindow(events);
    //         if (then) {
    //             this.game.queueSimpleStep(() => {
    //                 if (then.alwaysTriggers || events.every((event) => !event.cancelled)) {
    //                     let thenAbility = new DieAbility(this.die, then);
    //                     let thenContext = thenAbility.createContext(context.player);
    //                     thenContext.preThenEvents = events;
    //                     thenContext.preThenEvent = events[0];
    //                     if (
    //                         !thenAbility.meetsRequirements(thenContext) &&
    //                         thenAbility.condition(thenContext)
    //                     ) {
    //                         this.game.resolveAbility(thenContext);
    //                     }
    //                 }
    //             });
    //         }
    //     } else if (then && then.alwaysTriggers) {
    //         let thenAbility = new DieAbility(this.die, then);
    //         let thenContext = thenAbility.createContext(context.player);
    //         if (!thenAbility.meetsRequirements(thenContext) && thenAbility.condition(thenContext)) {
    //             this.game.resolveAbility(thenContext);
    //         }
    //     }

    //     for (let action of actions) {
    //         if (action.postHandler) {
    //             action.postHandler(context, action);
    //         }
    //     }
    // }

    // todo: needed?
    // eslint-disable-next-line no-unused-vars
    addSubEvent(event, context) {
        return;
    }

    isAction() {
        return true;
    }

    isCardAbility() {
        return false;
    }
}

module.exports = DieAbility;
