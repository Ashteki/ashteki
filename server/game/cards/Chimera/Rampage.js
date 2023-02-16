const RevealAct = require("../../BaseActions/RevealAct");
const Card = require("../../Card");
const BehaviourCard = require("../../solo/BehaviourCard");

class Rampage extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            gameAction: ability.actions.addStatusToken((context) => ({
                amount: 2,
                target: context.source
            }))
        });
    }
}

Rampage.id = 'rampage';

module.exports = Rampage