const Card = require('../../Card.js');

class MagicSyphon extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Magic Syphon',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            location: 'spellboard',
            gameAction: ability.actions.changeDice({
                numDice: 1,
                owner: 'self'
            }),
            then: {
                //todo: this isn't right - need to target a player then select from their dice
                alwaysTriggers: true,
                gameAction: ability.actions.changeDice((context) => ({
                    numDice: 1,
                    owner: context.player.checkRestrictions('changeOpponentsDice') ? 'any' : 'self'
                }))
            }
        });
    }
}

MagicSyphon.id = 'magic-syphon';

module.exports = MagicSyphon;
