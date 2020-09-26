const ExhaustDieAbility = require('./BaseActions/ExhaustDieAbility');
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
    }

    get type() {
        return 'die';
    }

    getSummary(activePlayer) {
        let isOwner = activePlayer === this.owner;
        //let selectionState = activePlayer.getCardSelectionState(this);

        let state = {
            uuid: this.uuid,
            magic: this.magic,
            level: this.level,
            exhausted: this.exhausted,
            canPlay: !!(
                activePlayer === this.game.activePlayer &&
                isOwner &&
                this.getLegalActions(activePlayer).length > 0
            )
        };

        // return Object.assign(state, selectionState);
        return state;
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
        actions.push(new ExhaustDieAbility(this));

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
}

module.exports = Die;
