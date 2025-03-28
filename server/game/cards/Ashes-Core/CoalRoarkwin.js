const Card = require('../../Card.js');
const { BattlefieldTypes, PhoenixbornTypes } = require('../../../constants.js');

class CoalRoarkwin extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Slash',
            cost: [ability.costs.sideAction(), ability.costs.chosenDiscard(1, false)],
            target: {
                // target a Unit, or if no units then the pb is valid
                activePromptTitle: 'Choose a target to Slash',
                cardType: [...BattlefieldTypes, ...PhoenixbornTypes],
                cardCondition: (card) => {
                    return (
                        BattlefieldTypes.includes(card.type) ||
                        card.controller.unitsInPlay.length == 0 // implies the cardtype is pb
                    );
                },
                gameAction: ability.actions.dealDamage()
            }
        });
    }
}

CoalRoarkwin.id = 'coal-roarkwin';

module.exports = CoalRoarkwin;
