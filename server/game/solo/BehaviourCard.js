const Card = require("../Card");
const ThenAbility = require("../ThenAbility");

class BehaviourCard extends Card {
    handleBehaviourRoll(behaviourRoll) {

    }

    behaviour(properties) {
        return new ThenAbility(this.game, this.owner.phoenixborn, properties);
    }
}

module.exports = BehaviourCard;
