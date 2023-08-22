const GameAction = require('./GameAction');

class ChooseGameAction extends GameAction {
    constructor(propertyFactory) {
        super(propertyFactory);
        this.choices = {};
        this.messages = {};
    }

    setDefaultProperties() {
        this.activePromptTitle = 'Select an action:';
        this.player = null;
        this.gameActions = []; // This shouldn't be set as a property
    }

    setup() {
        super.setup();
        this.effectMsg = 'take a chosen action';
    }

    update(context) {
        super.update(context);
        for (const key of Object.keys(this.choices)) {
            if (!Array.isArray(this.choices[key])) {
                this.choices[key] = [this.choices[key]];
            }
        }

        this.gameActions = Object.values(this.choices).reduce(
            (array, actions) => array.concat(actions),
            []
        );
        for (let gameAction of this.gameActions) {
            gameAction.update(context);
        }

        this.setTarget(this.target);
    }

    setTarget(target) {
        super.setTarget(target);
        for (let gameAction of this.gameActions) {
            gameAction.setDefaultTarget(() => target);
        }

        if (this.player && this.player !== target.controller) {
            this.effectMsg = 'make {1} ' + this.effectMsg;
            this.effectArgs = () => this.player;
        }
    }

    preEventHandler(context) {
        super.preEventHandler(context);
        let activePromptTitle = this.activePromptTitle;
        let choices = Object.keys(this.choices);
        choices = choices.filter((key) =>
            this.choices[key].some((action) => action.hasLegalTarget(context))
        );
        let handlers = choices.map((choice) => {
            return () => {
                this.choice = choice;
                if (this.messages[choice]) {
                    context.game.addMessage(this.messages[choice], context.player, this.target);
                }

                for (let gameAction of this.choices[choice]) {
                    context.game.queueSimpleStep(() => gameAction.preEventHandler(context));
                }
            };
        });
        const properties = {
            activePromptTitle,
            context,
            choices,
            handlers
        };
        let choosingPlayer = this.player || context.player;
        if (choosingPlayer.isDummy) {
            choosingPlayer = choosingPlayer.opponent;
            properties.promptTitle = 'CHIMERA CHOICE';
            properties.style = 'danger';
        }
        context.game.promptWithHandlerMenu(choosingPlayer, properties);
    }

    hasLegalTarget(context) {
        this.update(context);
        return this.gameActions.some((gameAction) => gameAction.hasLegalTarget(context));
    }

    canAffect(target, context) {
        return this.gameActions.some((gameAction) => gameAction.canAffect(target, context));
    }

    getEventArray(context) {
        if (!this.choice) {
            return [];
        }

        return this.choices[this.choice].reduce(
            (array, action) => array.concat(action.getEventArray(context)),
            []
        );
    }
}

module.exports = ChooseGameAction;
