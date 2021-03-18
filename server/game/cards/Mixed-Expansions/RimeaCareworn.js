const Card = require('../../Card.js');

class RimeaCareworn extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Visions',
            cost: ability.costs.sideAction(),
            gameAction: ability.actions.rearrangeCards((context) => ({
                target: context.player.opponent,
                purgeType: 'bottom'
            })),
            preferActionPromptMessage: true
        });
    }
}

RimeaCareworn.id = 'rimea-careworn';

module.exports = RimeaCareworn;
