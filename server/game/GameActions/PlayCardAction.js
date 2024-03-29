const CardGameAction = require('./CardGameAction');

class PlayCardAction extends CardGameAction {
    constructor(propertyFactory) {
        super(propertyFactory);
        this.ignoreActionCost = false;
        this.playedAsReaction = undefined;
        this.ignoreDiceCost = false;
    }

    setDefaultProperties() {
        this.location = 'hand';
    }

    setup() {
        super.setup();
        this.name = 'play';
        this.effectMsg = 'play {0}';
    }

    canAffect(card, context) {
        if (!super.canAffect(card, context)) {
            return false;
        }

        let actions = card
            .getActions(this.location)
            .filter((action) => action.title.includes('Play'));
        return !!actions.find((action) => {
            const actionContext = action.createContext(context.player);
            actionContext.playedAsReaction = this.playedAsReaction;
            return !action.meetsRequirements(actionContext, this.getIgnoredRequirements());
        });
    }

    getIgnoredRequirements() {
        const ignores = ['location'];
        if (this.ignoreActionCost) {
            ignores.push('actionCost');
        }
        if (this.ignoreDiceCost) {
            ignores.push('diceCost');
        }
        return ignores;
    }

    getEvent(card, context) {
        return super.createEvent(
            'unnamedEvent',
            {
                card: card,
                context: context,
                ignoreActionCost: this.ignoreActionCost,
                ignoreDiceCost: this.ignoreDiceCost
            },
            () => {
                let playActions = card.getActions(this.location).filter((action) => {
                    if (action.title.includes('Play')) {
                        let newContext = action.createContext(context.player);
                        newContext.playedAsReaction = this.playedAsReaction;
                        return !action.meetsRequirements(newContext, this.getIgnoredRequirements());
                    } else {
                        return false;
                    }
                });

                let action;
                if (playActions.length > 1) {
                    context.game.promptWithHandlerMenu(context.player, {
                        activePromptTitle: 'Play ' + card.name + ':',
                        choices: playActions.map((ability) => ability.title),
                        handlers: playActions.map((ability) => () => (action = ability)),
                        source: card
                    });
                } else if (playActions.length === 1) {
                    action = playActions[0];
                } else {
                    return;
                }

                context.game.queueSimpleStep(() => {
                    let actionContext = action.createContext(context.player);
                    if (this.ignoreActionCost) {
                        actionContext.ignoreActionCost = true;
                    }
                    if (this.ignoreDiceCost) {
                        actionContext.ignoreDiceCost = true;
                    }
                    if (this.playedAsReaction) {
                        actionContext.playedAsReaction = true;
                    }
                    context.game.resolveAbility(actionContext);
                });
            });
    }
}

module.exports = PlayCardAction;
