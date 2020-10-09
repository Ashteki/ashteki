const EffectSource = require('./EffectSource');

// const GameObject = require('./GameObject');

class Die extends EffectSource {
    constructor(owner, dieData) {
        super(owner.game);
        this.owner = owner;
        // this.data = dieData;
        this.magic = dieData.magic;
        this.level = dieData.level;
        this.exhausted = dieData.exhausted;

        this.abilities = {
            actions: [],
            reactions: [],
            persistentEffects: [],
            keywordReactions: [],
            keywordPersistentEffects: []
        };

        this.menu = [
            { command: 'exhaust', text: 'Exhaust/Ready', menu: 'main' },
            { command: 'raise', text: 'Raise', menu: 'main' },
            { command: 'lower', text: 'Lower', menu: 'main' }
        ];
    }

    get type() {
        return 'die';
    }

    getType() {
        return this.type;
    }

    get name() {
        return `${this.magic} ${this.level} die`;
    }

    getSummary(activePlayer) {
        let isOwner = activePlayer === this.owner;
        let selectionState = activePlayer.getDieSelectionState(this);

        let state = {
            uuid: this.uuid,
            magic: this.magic,
            level: this.level,
            exhausted: this.exhausted,
            canPlay: !!(
                activePlayer === this.game.activePlayer &&
                isOwner &&
                this.getLegalActions(activePlayer).length > 0
            ),
            menu: this.getMenu()
        };

        return Object.assign(state, selectionState);
    }

    getMenu() {
        var menu = [];

        if (!this.menu.length || !this.game.manualMode) {
            return undefined;
        }

        // menu.push({ command: 'click', text: 'Select Die', menu: 'main' });
        menu = menu.concat(this.menu);

        return menu;
    }

    use(player) {
        let legalActions = this.getLegalActions(player);

        if (legalActions.length === 0) {
            return false;
        } else if (legalActions.length === 1) {
            let action = legalActions[0];
            if (!this.game.activePlayer.optionSettings.confirmOneClick) {
                let context = action.createContext(player);
                this.game.resolveAbility(context);
                return true;
            }
        }

        let choices = legalActions.map((action) => action.title);
        let handlers = legalActions.map((action) => () => {
            let context = action.createContext(player);
            this.game.resolveAbility(context);
        });

        choices = choices.concat('Cancel');
        handlers = handlers.concat([() => true]);

        this.game.promptWithHandlerMenu(player, {
            activePromptTitle: 'Choose an ability:',
            source: this,
            choices: choices,
            handlers: handlers
        });

        return true;
    }

    getLegalActions(player) {
        let actions = this.getActions();
        actions = actions.filter((action) => {
            let context = action.createContext(player);
            return !action.meetsRequirements(context);
        });
        let canFight =
            actions.findIndex((action) => action.title === 'Fight with this creature') >= 0;
        if (this.getEffects('mustFightIfAble').length > 0 && canFight) {
            actions = actions.filter((action) => action.title === 'Fight with this creature');
        }

        return actions;
    }

    getActions() {
        let actions = [];
        // todo: add power dice abilities here? dependent upon magic type
        // actions.push(new ExhaustDieAbility(this));

        return actions.concat([], this.actions.slice());
    }

    get actions() {
        if (this.isBlank()) {
            return [];
        }

        return this.abilities.actions;
    }

    isBlank() {
        return this.anyEffect('blank');
    }

    exhaust() {
        this.exhausted = true;
    }

    ready() {
        this.exhausted = false;
    }

    raise() {
        this.level = this.level == 'basic' ? 'class' : 'power';
    }

    lower() {
        this.level = this.level == 'power' ? 'class' : 'basic';
    }
}

module.exports = Die;
