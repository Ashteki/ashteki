const { CardType } = require('../../constants');

class BotBrain {

    weightActions(params) {
        // params.medNeeded = 
        params.legalActions.forEach((a) => {
            a.weight = this.evaluateAction(a, params);
        })
    }

    evaluateAction(action, params) {
        if (
            action.card.type === CardType.ActionSpell &&
            !action.canResolveTargets(params.context)
        ) {
            return 0.5;
        }

        if (
            action.getGameActions &&
            action.getGameActions().some((ga) => ga.name === 'changeDice') &&
            params.allActions.length > 1
        ) {
            return 0;
        }
        return 1;
    }
}

module.exports = BotBrain;
