const { CardType } = require('../../constants');

class BotBrain {

    weightActions(params) {
        // params.medNeeded = 
        params.legalActions.forEach((a) => {
            const value = this.evaluateAction(a, params);
            a.weight = value;
            if (params.context.game.round === 1 && a.isPlayAction) {
                this.tweakWeightByCardType(a);
            }
        })
    }

    evaluateAction(action, params) {
        if (action.card.type === CardType.ActionSpell) {
            const playAction = action.card.abilities.reactions.find(a => a.properties.play === true);
            // don't play an action that cannot resolve targets
            if (!playAction.canResolveTargets(params.context)) {
                return 0;
            }
        }

        if (
            action.getGameActions &&
            action.getGameActions(params.context).some((ga) => ga.name === 'changeDice') &&
            params.allActions.length > 1
        ) {
            return 0;
        }
        return 1;
    }

    tweakWeightByCardType(action) {
        let tweakValue = 0;
        switch (action.card.type) {
            case CardType.ReadySpell:
                tweakValue = 0.5;
                break;
            case CardType.Ally:
                tweakValue = 0.4;
                break;

        }

        action.weight += tweakValue;
    }
}

module.exports = BotBrain;
