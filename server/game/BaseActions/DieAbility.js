const AbilityContext = require('../AbilityContext');
const BaseAbility = require('../baseability');

class DieAbility extends BaseAbility {
    constructor(die, properties) {
        super(properties);
        this.properties = properties;
        this.die = die;
        this.game = die.game;
        this.condition = properties.condition || (() => true);
        this.title = properties.title ? properties.title : 'Power Ability';
        this.handler = properties.handler || this.executeGameActionPrehandlers;
    }

    createContext(player = this.die.owner) {
        return new AbilityContext({
            ability: this,
            game: this.die.game,
            player: player,
            source: this.die
        });
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

    //todo: merge this with Thenability
    executeGameActionPrehandlers(context) {
        let actions = this.getGameActions(context);
        for (const action of actions) {
            action.preEventHandler(context);
        }

        this.game.queueSimpleStep(() => this.executeGameActions(actions, context));
    }

    getGameActions(context) {
        // if there are any targets, look for gameActions attached to them
        let actions = this.targets.reduce(
            (array, target) => array.concat(target.getGameAction(context)),
            []
        );
        // look for a gameAction on the ability itself, on an upgrade execute that action on its parent, otherwise on the card itself
        return actions.concat(this.gameAction);
    }

    executeHandler(context) {
        this.handler(context);
        this.game.queueSimpleStep(() => this.game.checkGameState());
    }

    executeGameActions(actions, context) {
        // Get any gameActions for this ability
        // Get their events, and execute simultaneously
        let events = actions.reduce(
            (array, action) => array.concat(action.getEventArray(context)),
            []
        );
        let then = this.properties.then;
        if (then && typeof then === 'function') {
            then = then(context);
        }

        if (events.length > 0) {
            this.game.openEventWindow(events);
            if (then) {
                this.game.queueSimpleStep(() => {
                    if (then.alwaysTriggers || events.every((event) => !event.cancelled)) {
                        let thenAbility = new DieAbility(this.die, then);
                        let thenContext = thenAbility.createContext(context.player);
                        thenContext.preThenEvents = events;
                        thenContext.preThenEvent = events[0];
                        if (
                            !thenAbility.meetsRequirements(thenContext) &&
                            thenAbility.condition(thenContext)
                        ) {
                            this.game.resolveAbility(thenContext);
                        }
                    }
                });
            }
        } else if (then && then.alwaysTriggers) {
            let thenAbility = new DieAbility(this.die, then);
            let thenContext = thenAbility.createContext(context.player);
            if (!thenAbility.meetsRequirements(thenContext) && thenAbility.condition(thenContext)) {
                this.game.resolveAbility(thenContext);
            }
        }

        for (let action of actions) {
            if (action.postHandler) {
                action.postHandler(context, action);
            }
        }
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

module.exports = DieAbility;
