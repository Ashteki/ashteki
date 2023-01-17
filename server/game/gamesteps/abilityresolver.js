const { Location, CardType } = require('../../constants.js');
const BaseStepWithPipeline = require('./basestepwithpipeline.js');
const SimpleStep = require('./simplestep.js');

class AbilityResolver extends BaseStepWithPipeline {
    constructor(game, context) {
        super(game);

        this.context = context;
        this.canCancel = true;
        this.targetResults = {};
        this.costResults = this.getCostResults();
        this.mayResult = { cancelled: false };
        this.warningsResult = { cancelled: false };
        this.initialise();
    }

    initialise() {
        this.pipeline.initialise([
            new SimpleStep(this.game, () => this.createSnapshot()),
            new SimpleStep(this.game, () => this.resolveMayClause()),
            new SimpleStep(this.game, () => this.checkWarnings()),
            new SimpleStep(this.game, () => this.resolveCosts()),
            new SimpleStep(this.game, () => this.payCosts()),
            new SimpleStep(this.game, () => this.resolveTargets()),
            new SimpleStep(this.game, () => this.checkForCancel()),
            new SimpleStep(this.game, () => this.initiateAbility()),
            new SimpleStep(this.game, () => this.raiseResolvedEvent())
        ]);
    }

    getCostResults() {
        return {
            cancelled: false,
            canCancel: this.canCancel,
            events: [],
            playCosts: true,
            triggerCosts: true
        };
    }

    createSnapshot() {
        if (['Ally', 'Conjuration'].includes(this.context.source.getType())) {
            this.context.cardStateWhenInitiated = this.context.source.createSnapshot();
        }
    }

    resolveMayClause() {
        this.context.ability.resolveMayClause(this.context, this.mayResult);
    }

    checkWarnings() {
        if (this.cancelled) {
            return;
        } else if (this.mayResult.cancelled) {
            this.cancelled = true;
            return;
        }
        this.context.ability.checkWarnings(this.context, this.warningsResult);
    }

    resolveCosts() {
        if (this.cancelled) {
            return;
        } else if (this.warningsResult.cancelled) {
            this.cancelled = true;
            return;
        }

        // this.costResults.canCancel = this.canCancel;
        // this.context.stage = Stages.Cost;
        this.context.ability.resolveCosts(this.context, this.costResults);

        if (this.costResults.cancelled) {
            this.cancelled = true;
        }
    }

    payCosts() {
        if (this.cancelled) {
            return;
        } else if (this.costResults.cancelled) {
            this.cancelled = true;
            return;
        }
        this.passPriority = true;
        if (this.costResults.events.length > 0) {
            this.game.openEventWindow(this.costResults.events);
        }
    }

    resolveTargets() {
        if (this.cancelled) {
            return;
        }

        this.targetResults = this.context.ability.resolveTargets(this.context);
    }

    checkForCancel() {
        if (this.cancelled) {
            return;
        }

        this.cancelled = this.targetResults.cancelled;

        if (!this.costResults.cancelled && this.cancelled) {
            this.refundCosts();
        }
    }

    refundCosts() {
        this.costResults.events.forEach((event) => {
            if (event.resolved) {
                if (event.name === 'onDiceSpent') {
                    event.dice.forEach((die) => {
                        die.ready();
                    });
                }
                if (event.name === 'onDiePowerSpent') {
                    event.die.ready();
                }
                if (event.name === 'onDieExhausted') {
                    event.die.ready();
                }
                if (event.name === 'onSpendSideAction') {
                    event.player.actions.side += 1;
                }
                if (event.name === 'onCardExhausted') {
                    event.card.tokens.exhaustion -= 1;
                }
                if (event.name === 'useCardEvent') {
                    this.game.undoCardUsed();
                }
            }
        });
    }

    initiateAbility() {
        if (this.cancelled) {
            return;
        } else if (this.targetResults.cancelled) {
            this.cancelled = true;
            return;
        }

        if (
            this.context.source.isLimited() ||
            (this.context.ability.properties && this.context.ability.properties.isLimited)
        ) {
            this.context.player.limitedPlayed += 1;
        }

        // Increment limits (limits aren't used up on cards in hand)
        if (
            this.context.ability.limit &&
            this.context.source.location !== Location.Hand &&
            (!this.context.cardStateWhenInitiated ||
                this.context.cardStateWhenInitiated.location === this.context.source.location)
        ) {
            this.context.ability.limit.increment(this.context.player);
        }

        // move cards played from hand to active location
        if (this.context.source.location === 'hand') {
            this.context.player.moveCard(this.context.source, 'being played');
            if (this.context.source.type === CardType.ReactionSpell) {
                this.context.game.cardUsed(this.context.source);
            }
        }

        if (this.context.source.type === 'die' && !this.context.preThenEvent) {
            this.game.diePowerUsed(this.context.source);
        }

        if (this.context.source.type === CardType.ReactionSpell && !this.context.preThenEvent) {
            this.game.queueUserAlert(this.context);
        }

        this.game.raiseEvent(
            'onAbilityInitiated',
            {
                context: this.context,
                noGameStateCheck: true
            },
            () => this.executeHandler()
        );

        this.context.game.queueSimpleStep(() => {
            if (this.context.source.location === 'being played') {
                let location =
                    this.context.source.mostRecentEffect('actionCardLocationAfterPlay') ||
                    'discard';
                this.context.source.owner.moveCard(this.context.source, location);
            }
        });
    }

    executeHandler() {
        if (this.cancelled) {
            return;
        }

        this.context.stage = 'effect';
        // this.context.ability.displayMessage(this.context);
        this.context.ability.executeHandler(this.context);
    }

    raiseResolvedEvent() {
        if (this.cancelled) {
            return;
        }

        this.game.raiseEvent('onAbilityResolved', { context: this.context });
    }
}

module.exports = AbilityResolver;
