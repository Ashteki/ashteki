const AbilityDsl = require('./abilitydsl');
const DieAbility = require('./BaseActions/DieAbility');
const { Costs } = require('./costs');
const PlayableObject = require('./PlayableObject');

class Die extends PlayableObject {
    constructor(owner, dieData) {
        super(owner.game);
        this.copyEffect = 'copyDie';
        this.attachable = false;

        this.owner = owner;
        this.magic = dieData.magic;
        this.level = dieData.level;
        this.exhausted = dieData.exhausted;

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
            id: this.magic + '-magic',
            uuid: this.uuid,
            magic: this.magic,
            level: this.level,
            location: this.location,
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

        menu.push({ command: 'click', text: 'Select Die', menu: 'main' });
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

        return actions;
    }

    getActions() {
        let actions = [];

        if (this.level == 'power') {
            actions.push(this.getPowerDieAction());
        }

        return actions.concat([], this.actions.slice());
    }

    get actions() {
        if (this.isBlank()) {
            return [];
        }

        return this.abilities.actions;
    }

    getPowerDieAction() {
        switch (this.magic) {
            case 'ceremonial':
                return this.action({
                    title: 'Ceremonial Dice Power',
                    cost: [Costs.sideAction(), Costs.exhaustDie()],
                    target: {
                        controller: 'self',
                        cardType: 'Ally',
                        location: 'discard',
                        gameAction: this.game.actions.moveCard({ destination: 'hand' })
                    },
                    then: {
                        gameAction: this.game.actions.dealDamage({
                            amount: 1,
                            target: this.owner.phoenixborn
                        })
                    },
                    message:
                        '{0} uses {1} to move {2} from discard to hand, and receives 1 PB damage'
                });
            case 'illusion':
                return this.action({
                    title: 'Illusion Dice Power',
                    cost: [Costs.sideAction(), Costs.exhaustDie()],
                    target: {
                        toSelect: 'die',
                        mode: 'upTo',
                        numDice: 2,
                        owner: 'opponent',
                        gameAction: this.game.actions.lowerDie()
                    },
                    message: '{0} uses {1} to lower up to 2 opponent dice'
                });
            case 'natural':
                return this.action({
                    title: 'Natural Dice Power',
                    cost: [Costs.sideAction(), Costs.exhaustDie()],
                    target: {
                        cardType: ['Ally', 'Conjuration'],
                        gameAction: this.game.actions.dealDamage({ amount: 1 })
                    },
                    message: '{0} uses {1} to deal 1 damage to {2}'
                });
            case 'charm':
                return this.action({
                    title: 'Charm Dice Power',
                    cost: [Costs.sideAction()],
                    target: {
                        cardType: ['Ally', 'Conjuration'],
                        controller: 'opponent',
                        gameAction: this.game.actions.attachDie({ upgradeDie: this })
                    },
                    message: '{0} attaches {1} to {2}',
                    messageArgs: (context) => context.target
                });
            case 'divine':
                return this.action({
                    title: 'Divine Dice Power',
                    cost: [Costs.sideAction()],
                    target: {
                        cardType: ['Ally', 'Conjuration'],
                        controller: 'self',
                        gameAction: this.game.actions.attachDie({ upgradeDie: this })
                    },
                    message: '{0} attaches {1} to {2}',
                    messageArgs: (context) => context.target
                });
            case 'sympathy':
                return this.action({
                    title: 'Sympathy Dice Power',
                    cost: [Costs.sideAction(), Costs.exhaustDie()],
                    gameAction: this.game.actions.draw(),
                    message: '{0} uses {1} to draw 1 card',
                    then: {
                        targets: {
                            myCard: {
                                activePromptTitle: 'Select a card to return to your deck',
                                controller: 'self',
                                location: 'hand',
                                optional: true
                            },
                            action: {
                                mode: 'select',
                                dependsOn: 'myCard',
                                player: 'self',
                                choices: {
                                    Top: this.game.actions.returnToDeck((context) => ({
                                        target: context.targets.myCard,
                                        shuffle: false
                                    })),
                                    Bottom: this.game.actions.returnToDeck((context) => ({
                                        bottom: true,
                                        target: context.targets.myCard,
                                        shuffle: false
                                    }))
                                }
                            }
                        }
                    }
                });
        }
    }

    action(properties) {
        const action = new DieAbility(this, properties);
        if (action.printedAbility) {
            this.abilities.actions.push(action);
        }

        return action;
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

    moveTo(targetLocation) {
        let originalLocation = this.location;
        this.location = targetLocation;

        if (originalLocation !== targetLocation) {
            this.updateAbilityEvents(originalLocation, targetLocation);
            this.updateEffects(originalLocation, targetLocation);
            this.game.emitEvent('onDieMoved', {
                die: this,
                originalLocation: originalLocation,
                newLocation: targetLocation
            });
        }
    }

    setupAbilities() {
        switch (this.magic) {
            case 'charm':
                this.attachable = true;
                this.whileAttached({
                    effect: AbilityDsl.effects.modifyAttack(-1)
                });
                break;
            case 'divine':
                this.attachable = true;
                this.whileAttached({
                    effect: AbilityDsl.effects.modifyAttack(1)
                });
                break;
        }
    }

    canPlayAsUpgrade() {
        return this.attachable;
    }

    isLimited() {
        return false;
    }
}

module.exports = Die;
