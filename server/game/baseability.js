const AbilityTargetAbility = require('./AbilityTargets/AbilityTargetAbility');
const AbilityTargetCard = require('./AbilityTargets/AbilityTargetCard');
const AbilityTargetSelect = require('./AbilityTargets/AbilityTargetSelect');
const AbilityTargetOptions = require('./AbilityTargets/AbilityTargetOptions');
const AbilityTargetDie = require('./AbilityTargets/AbilityTargetDie');
const ActionCost = require('./Costs/actioncost');
const DiceCost = require('./Costs/dicecost');
const AbilityTargetPlayer = require('./AbilityTargets/AbilityTargetPlayer');

/**
 * Base class representing an ability that can be done by the player. This
 * includes card actions, reactions, interrupts, playing a card, marshaling a
 * card.
 *
 * Most of the methods take a context object. While the structure will vary from
 * inheriting classes, it is guaranteed to have at least the `game` object, the
 * `player` that is executing the action, and the `source` card object that the
 * ability is generated from.
 */
class BaseAbility {
    constructor(properties, game) {
        this.properties = properties;
        this.game = game;
        this.gameAction = properties.gameAction || [];
        this.abilityType = '';
        this.printedAbility = false;
        if (!Array.isArray(this.gameAction)) {
            this.gameAction = [this.gameAction];
        }

        this.buildTargets(properties);
        this.cost = this.buildCost(properties.cost);
        this.nonDependentTargets = this.targets.filter((target) => !target.properties.dependsOn);
    }

    buildCost(cost) {
        if (!cost) {
            return [];
        }

        if (!Array.isArray(cost)) {
            return [cost];
        }

        return cost;
    }

    buildTargets(properties) {
        this.targets = [];
        if (properties.target) {
            this.targets.push(this.getAbilityTarget('target', properties.target));
        } else if (properties.targets) {
            for (const key of Object.keys(properties.targets)) {
                this.targets.push(this.getAbilityTarget(key, properties.targets[key]));
            }
        }
    }

    getAbilityTarget(name, properties) {
        if (properties.gameAction) {
            if (!Array.isArray(properties.gameAction)) {
                properties.gameAction = [properties.gameAction];
            }
        } else {
            properties.gameAction = [];
        }

        if (properties.toSelect) {
            switch (properties.toSelect) {
                case 'die':
                    return new AbilityTargetDie(name, properties, this);

                case 'player':
                    return new AbilityTargetPlayer(name, properties, this);
            }
        }


        if (properties.mode === 'select') {
            return new AbilityTargetSelect(name, properties, this);
        } else if (properties.mode === 'ability') {
            return new AbilityTargetAbility(name, properties, this);
        } else if (properties.mode === 'options') {
            return new AbilityTargetOptions(name, properties, this);
        }

        return new AbilityTargetCard(name, properties, this);
    }

    /**
     * @param {*} context
     * @returns {String}
     */
    meetsRequirements(context, ignoredRequirements = []) {
        // check legal targets exist
        // check costs can be paid
        // check for potential to change game state
        for (let target of this.targets) {
            target.resetGameActions();
        }

        for (let action of this.gameAction) {
            action.reset();
        }

        if (
            !ignoredRequirements.includes('allCost') &&
            !this.canPayCosts(context, ignoredRequirements)
        ) {
            return 'cost';
        } else if (
            this.checkThenAbilities() ||
            (this.printedAbility && this.abilityType === 'action')
        ) {
            return '';
        } else if (
            this.gameAction.length > 0 &&
            this.gameAction.some((gameAction) => gameAction.hasLegalTarget(context))
        ) {
            return '';
        } else if (this.targets.length > 0) {
            return this.canResolveTargets(context) ? '' : 'target';
        }

        return this.gameAction.length > 0 ? 'condition' : '';
    }

    checkThenAbilities() {
        return false;
    }

    resolveMayClause() {
        return;
    }

    checkWarnings(context, results) {
        if (this.properties.warnIf && this.properties.warning) {
            let warn = false;
            let warnIf = this.properties.warnIf;
            if (typeof warnIf === 'function') {
                warn = warnIf(context);
            }

            if (warn) {
                this.game.promptWithHandlerMenu(context.player, {
                    promptTitle: this.properties.title,
                    activePromptTitle: this.properties.warning + '\nDo you want to continue?',
                    context: context,
                    choices: ['Yes', 'No'],
                    handlers: [() => true, () => (results.cancelled = true)]
                });
            }
        }
    }

    /**
     * Return whether all costs are capable of being paid for the ability.
     *
     * @returns {Boolean}
     */
    canPayCosts(context, ignoredRequirements = []) {
        let cost = this.cost.concat(context.player.getAdditionalCosts(context));
        if (ignoredRequirements.includes('actionCost')) {
            cost = cost.filter((c) => !(c instanceof ActionCost));
        }
        if (ignoredRequirements.includes('diceCost')) {
            cost = cost.filter((c) => !(c instanceof DiceCost));
        }
        return cost.every((cost) => cost.canPay(context));
    }

    /**
     * Pays all costs for the ability simultaneously.
     */
    payCosts(context) {
        let cost = this.cost.concat(context.player.getAdditionalCosts(context));
        return cost.map((cost) => cost.payEvent(context));
    }

    /**
     * Returns whether there are eligible cards available to fulfill targets.
     *
     * @returns {Boolean}
     */
    canResolveTargets(context) {
        return this.nonDependentTargets.some((target) => target.canResolve(context));
    }

    /**
     * Prompts the current player to choose each target defined for the ability.
     */
    resolveTargets(context) {
        let targetResults = {
            cancelled: false,
            payCostsFirst: false,
            delayTargeting: null
        };
        for (let target of this.targets) {
            context.game.queueSimpleStep(() => {
                if (target.hasLegalTarget(context)) {
                    target.resolve(context, targetResults);
                }
            });
        }

        return targetResults;
    }

    resolveRemainingTargets(context, nextTarget) {
        let index = this.targets.indexOf(nextTarget);
        for (let target of this.targets.slice(index)) {
            context.game.queueSimpleStep(() => target.resolve(context, {}));
        }
    }

    hasLegalTargets(context) {
        return this.nonDependentTargets.every((target) => target.hasLegalTarget(context));
    }

    checkAllTargets(context) {
        return this.nonDependentTargets.every((target) => target.checkTarget(context));
    }

    // eslint-disable-next-line no-unused-vars
    displayMessage(context) { }

    /**
     * Executes the ability once all costs have been paid. Inheriting classes
     * should override this method to implement their behavior; by default it
     * does nothing.
     */
    // eslint-disable-next-line no-unused-vars
    executeHandler(context) { }

    isAction() {
        return false;
    }

    isCardPlayed() {
        return false;
    }

    isCardAbility() {
        return false;
    }

    resolveCosts(context, results) {
        // for (let cost of this.getCosts(context, results.playCosts, results.triggerCosts)) {
        let costs = this.cost;
        if (context.ignoreActionCost) {
            costs = costs.filter((c) => !(c instanceof ActionCost));
        }
        if (context.ignoreDiceCost) {
            costs = costs.filter((c) => !(c instanceof DiceCost));
        }
        for (let cost of costs) {
            context.game.queueSimpleStep(() => {
                if (!results.cancelled) {
                    // if (cost.addEventsToArray) {
                    //     cost.addEventsToArray(results.events, context, results);
                    // } else {
                    if (cost.resolve) {
                        cost.resolve(context, results);
                    }
                    context.game.queueSimpleStep(() => {
                        if (!results.cancelled) {
                            let newEvents = cost.payEvent
                                ? cost.payEvent(context)
                                : context.game.getEvent('payCost', {}, () => cost.pay(context));
                            if (Array.isArray(newEvents)) {
                                for (let event of newEvents) {
                                    results.events.push(event);
                                }
                            } else {
                                results.events.push(newEvents);
                            }
                        }
                    });
                    // }
                }
            });
        }
    }
}

module.exports = BaseAbility;
