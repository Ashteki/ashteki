const _ = require('underscore');

const CardSelector = require('../CardSelector.js');
const AbilityTarget = require('./AbilityTarget.js');

class AbilityTargetCard extends AbilityTarget {
    constructor(name, properties, ability) {
        super(properties);
        this.name = name;
        this.random = properties.random || false;
        for (let gameAction of this.properties.gameAction) {
            gameAction.setDefaultTarget((context) => context.targets[name]);
        }

        this.selector = this.getSelector(properties);
        this.dependentTarget = null;
        this.dependentCost = null;
        if (this.properties.dependsOn) {
            let dependsOnTarget = ability.targets.find(
                (target) => target.name === this.properties.dependsOn
            );
            dependsOnTarget.dependentTarget = this;
        }
    }

    getSelector(properties) {
        let cardCondition = (card, context) => {
            let contextCopy = context.copy();
            contextCopy.targets[this.name] = this.selector.formatSelectParam([card]);
            if (this.name === 'target') {
                contextCopy.target = contextCopy.targets[this.name];
            }

            this.resetGameActions();
            return (
                (!properties.cardCondition || properties.cardCondition(card, contextCopy)) &&
                (properties.gameAction.length === 0 ||
                    properties.gameAction.some((gameAction) =>
                        gameAction.hasLegalTarget(contextCopy)
                    ))
            );
        };

        return CardSelector.for(
            Object.assign({}, properties, { cardCondition: cardCondition, targets: true })
        );
    }

    canResolve(context) {
        // if this depends on another target, that will check hasLegalTarget already
        return !!this.properties.dependsOn || this.hasLegalTarget(context);
    }

    hasLegalTarget(context) {
        return this.selector.hasEnoughTargets(context);
    }

    getGameAction(context) {
        return this.properties.gameAction.filter((gameAction) =>
            gameAction.hasLegalTarget(context)
        );
    }

    getAllLegalTargets(context) {
        return this.selector.getAllLegalTargets(context);
    }

    resolve(context, targetResults) {
        if (targetResults.cancelled) {
            return;
        }

        if (this.properties.autoTarget) {
            const autoTarget = this.properties.autoTarget(context);
            let checkArray = Array.isArray(autoTarget) ? autoTarget : [autoTarget];
            const allTargetsValid = checkArray.every((t) => this.selector.canTarget(t, context));
            if (allTargetsValid) {
                this.setSelectedCard(context, autoTarget);
            } else {
                targetResults.cancelled = true;
            }
            return;
        }

        if (this.random) {
            const cardList = this.selector.findPossibleCards(context);
            let amount = Math.min(this.selector.numCards, cardList.length);
            let cards = _.shuffle(cardList).slice(0, amount);

            context.targets[this.name] = cards;
            if (this.name === 'target') {
                context.target = cards;
            }
            return;
        }

        let otherProperties = _.omit(this.properties, 'cardCondition', 'player');

        let buttons = [];
        let waitingPromptTitle = '';
        if (context.stage === 'pretarget') {
            buttons.push({ text: 'Cancel', arg: 'cancel' });
            if (context.ability.abilityType === 'action') {
                waitingPromptTitle = 'Waiting for opponent to take an action or pass';
            } else {
                waitingPromptTitle = 'Waiting for opponent';
            }
        }

        let promptProperties = {
            waitingPromptTitle: waitingPromptTitle,
            context: context,
            selector: this.selector,
            buttons: buttons,
            onSelect: (player, card) => {
                this.setSelectedCard(context, card);
                targetResults.firstTarget = false;
                return true;
            },
            onCancel: () => {
                super.onCancel(targetResults);
                return true;
            }
        };
        let player = context.player;
        if (this.properties.player && this.properties.player === 'opponent') {
            player = player.opponent;
        }

        context.game.promptForSelect(player, Object.assign(promptProperties, otherProperties));
    }

    setSelectedCard(context, card) {
        context.targets[this.name] = card;
        if (this.name === 'target') {
            context.target = card;
        }
    }

    checkTarget(context) {
        if (this.properties.optional) {
            return !this.dependentTarget || this.dependentTarget.checkTarget(context);
        } else if (!context.targets[this.name]) {
            return false;
        }

        let cards = context.targets[this.name];
        if (!Array.isArray(cards)) {
            cards = [cards];
        }

        return (
            cards.every((card) => this.selector.canTarget(card, context)) &&
            this.selector.hasEnoughSelected(cards, context) &&
            !this.selector.hasExceededLimit(cards) &&
            (!this.dependentTarget || this.dependentTarget.checkTarget(context))
        );
    }
}

module.exports = AbilityTargetCard;
