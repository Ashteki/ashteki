const { Location, CardType, ActionSpellTypes } = require('../../constants.js');
// const TriggeredAbility = require('../triggeredability.js');
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
            new SimpleStep(this.game, () => this.resolveAbility())

        ]);
    }

    resolveAbility() {
        // skip execution per may clause
        if (this.mayResult.cancelled) {
            this.game.queueStep(new SimpleStep(this.game, () => {
                this.context.ability.queueThenAbility(this.context);
            }));
        } else if (!this.cancelled) {
            this.game.queueStep(new SimpleStep(this.game, () => this.checkWarnings()));
            this.game.queueStep(new SimpleStep(this.game, () => this.resolveCosts()));
            this.game.queueStep(new SimpleStep(this.game, () => this.payCosts()));
            this.game.queueStep(new SimpleStep(this.game, () => this.statusAbilityAlert()));
            this.game.queueStep(new SimpleStep(this.game, () => this.resolveTargets()));
            this.game.queueStep(new SimpleStep(this.game, () => this.checkForCancel()));
            this.game.queueStep(new SimpleStep(this.game, () => this.initiateAbility()));
            this.game.queueStep(new SimpleStep(this.game, () => this.raiseResolvedEvent()));
        }
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
            // this.cancelled = true;
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

    statusAbilityAlert() {
        if (
            !this.cancelled &&
            this.context.source.type !== 'die' &&
            this.context.source.location === 'play area' &&
            this.context.ability.logUse &&
            this.context.ability.logUse(this.context)
        ) {
            this.game.cardUsed(this.context.source, this.context.player);
            this.game.queueUserAlert(this.context, {
                showSplash: true,
                timed: true,
                promptTitle: 'Aspect Status Ability',
                controls: [
                    {
                        type: 'targeting',
                        source: this.context.source.getShortSummary()
                    }
                ],
                menuTitle: this.context.player.name + ' uses ' + this.context.source.name
            });
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
        } else if (this.targetResults.skipped) {
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
                this.context.game.cardPlayed(this.context.source, this.context.player);
            }
        }

        if (this.context.source.type === 'die' && !this.context.preThenEvent) {
            this.game.diePowerUsed(this.context.source, this.context.player);
        }

        if (
            !this.game.solo &&
            this.context.source.type === CardType.ReactionSpell &&
            !this.context.preThenEvent
        ) {
            this.game.queueUserAlert(this.context, {
                timed: true,
                promptTitle: 'Reaction Played!',
                controls: [
                    {
                        type: 'targeting',
                        source: this.context.source.getShortSummary()
                    }
                ],
                menuTitle: this.context.player.name + ' plays ' + this.context.source.name
            });
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

        this.game.raiseEvent('onAbilityResolved', { context: this.context }, (event) => {
            // this.game.resetRemovedFlags();
            if (!event.context.preThenEvent) {
                this.game.saveReplayState('ability');
            }
        });
    }
}

module.exports = AbilityResolver;
