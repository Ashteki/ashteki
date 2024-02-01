const _ = require('underscore');
const DieSelector = require('../DieSelector');
const AbilityTarget = require('./AbilityTarget');

class AbilityTargetDie extends AbilityTarget {
    constructor(name, properties, ability) {
        super(name, properties);

        this.properties = properties;
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
        this.announceTargets = properties.announceTargets;
    }

    getSelector(properties) {
        let dieCondition = (die, context) => {
            let contextCopy = context.copy();
            contextCopy.targets[this.name] = this.selector.formatSelectParam([die]);
            if (this.name === 'target') {
                contextCopy.target = contextCopy.targets[this.name];
            }

            this.resetGameActions();
            return (
                (!properties.dieCondition || properties.dieCondition(die, contextCopy)) &&
                (properties.gameAction.length === 0 ||
                    properties.gameAction.some((gameAction) =>
                        gameAction.hasLegalTarget(contextCopy)
                    ))
            );
        };

        return DieSelector.for(
            Object.assign({}, properties, { dieCondition: dieCondition, targets: true })
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

    setSelectedDie(context, die) {
        context.targets[this.name] = die;
        if (this.name === 'target') {
            context.target = die;
        }
        if (this.announceTargets) {
            context.game.addAlert(
                'info',
                '{0} selected {1} as target',
                context.player,
                context.targets[this.name]
            );
        }
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
                this.setSelectedDie(context, autoTarget);
            } else {
                targetResults.cancelled = true;
            }
            return;
        }

        let otherProperties = _.omit(this.properties, 'dieCondition', 'player');

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
            onSelect: (player, die) => {
                this.setSelectedDie(context, die);

                return true;
            },
            onCancel: () => {
                targetResults.cancelled = true;
                return true;
            }
        };

        let player = context.player;
        if (this.properties.player && this.properties.player === 'opponent') {
            player = player.opponent;
        }

        context.game.promptForDieSelect(player, Object.assign(promptProperties, otherProperties));
    }

    checkTarget(context) {
        if (this.properties.optional) {
            return !this.dependentTarget || this.dependentTarget.checkTarget(context);
        } else if (!context.targets[this.name]) {
            return false;
        }

        let dice = context.targets[this.name];
        if (!Array.isArray(dice)) {
            dice = [dice];
        }

        return (
            dice.every((die) => this.selector.canTarget(die, context)) &&
            this.selector.hasEnoughSelected(dice, context) &&
            !this.selector.hasExceededLimit(dice) &&
            (!this.dependentTarget || this.dependentTarget.checkTarget(context))
        );
    }
}

module.exports = AbilityTargetDie;
