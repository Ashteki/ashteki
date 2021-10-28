const Card = require('../../Card.js');
const { BattlefieldTypes, CardType } = require('../../../constants.js');

class CoalRoarkwin extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Slash',
            cost: [ability.costs.sideAction(), ability.costs.chosenDiscard()],
            target: {
                // target a Unit, or if no units then the pb is valid
                activePromptTitle: 'Choose a target to Slash',
                cardType: [...BattlefieldTypes, CardType.Phoenixborn],
                cardCondition: (card) => {
                    return (
                        BattlefieldTypes.includes(card.type) ||
                        card.controller.cardsInPlay.length == 0 // implies the cardtype is pb
                    );
                },
                gameAction: ability.actions.dealDamage({ amount: 1 })
            }
        });
    }
}

CoalRoarkwin.id = 'coal-roarkwin';

module.exports = CoalRoarkwin;
