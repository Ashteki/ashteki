const { CardType } = require('../../constants');

class BotBrain {

    weightActions(params) {
        // params.medNeeded = 
        params.legalActions.forEach((a) => {
            a.weight = this.evaluateAction(a, params);
        })
    }

    evaluateAction(action, params) {
        if (action.card.type === CardType.ActionSpell) {
            const playAction = action.card.abilities.reactions.find(a => a.properties.play === true);
            if (!playAction.canResolveTargets(params.context)) {
                return 0.5;
            }
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
