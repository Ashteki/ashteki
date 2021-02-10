const GameAction = require('./GameAction');
const DieSelector = require('../DieSelector');

class DiceGameAction extends GameAction {
    constructor(propertyFactory) {
        super(propertyFactory);
        this.promptForSelect = null;
        this.promptWithHandlerMenu = null;
        this.promptWithOptionsMenu = null;
    }

    setup() {
        this.targetType = ['die'];
    }

    hasLegalTarget(context) {
        let result = super.hasLegalTarget(context);
        let contextCopy = context.copy();
        contextCopy.stage = 'effect';
        if (this.promptForSelect) {
            return this.getSelector().hasEnoughTargets(contextCopy);
        } else if (this.promptWithHandlerMenu && !this.promptWithHandlerMenu.customHandler) {
            return this.promptWithHandlerMenu.dice.some((die) => this.canAffect(die, contextCopy));
        }

        return result;
    }

    getSelector() {
        let condition = this.promptForSelect.dieCondition || (() => true);
        let dieCondition = (die, context) =>
            this.canAffect(die, context) && condition(die, context);

        return DieSelector.for(
            Object.assign({}, this.promptForSelect, { dieCondition: dieCondition })
        );
    }

    preEventHandler(context) {
        super.preEventHandler(context);
        if (this.promptForSelect) {
            let selector = this.getSelector();
            this.target = [];
            if (!selector.hasEnoughTargets(context)) {
                return;
            }

            let defaultProperties = {
                player: context.player,
                context: context,
                selector: selector,
                onSelect: (player, dice) => {
                    this.setTarget(dice);
                    if (this.promptForSelect.message) {
                        let messageArgs = this.promptForSelect.messageArgs || [];
                        if (typeof messageArgs === 'function') {
                            messageArgs = messageArgs(dice);
                        }

                        if (!Array.isArray(messageArgs)) {
                            messageArgs = [messageArgs];
                        }

                        context.game.addMessage(this.promptForSelect.message, ...messageArgs);
                    }

                    return true;
                }
            };
            let properties = Object.assign(defaultProperties, this.promptForSelect);
            context.game.promptForDieSelect(properties.player, properties);
        } else if (this.promptWithHandlerMenu) {
            let properties = this.promptWithHandlerMenu;
            if (!properties.customHandler) {
                properties.dice = properties.dice.filter((die) => this.canAffect(die, context));
                this.target = [];
            }

            if (properties.dice.length === 0) {
                return;
            }

            if (!properties.player) {
                properties.player = context.player;
            }

            if (properties.customHandler) {
                properties.dieHandler = (die) => properties.customHandler(die, this);
            }

            let defaultProperties = {
                context: context,
                dieHandler: (die) => {
                    this.setTarget(die);
                    if (properties.message) {
                        context.game.addMessage(
                            properties.message,
                            properties.player,
                            context.source,
                            die
                        );
                    }
                }
            };
            context.game.promptWithHandlerMenu(
                properties.player,
                Object.assign(defaultProperties, properties)
            );
        }
    }

    defaultTargets(context) {
        return context.source;
    }

    checkEventCondition(event) {
        return (
            this.canAffect(event.die, event.context) &&
            event.die.checkRestrictions(this.name, event.context)
        );
    }
}

module.exports = DiceGameAction;
