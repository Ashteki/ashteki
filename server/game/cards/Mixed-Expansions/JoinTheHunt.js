const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class JoinTheHunt extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Join the Hunt',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            location: 'spellboard',
            target: {
                controller: 'self',
                cardType: BattlefieldTypes,
                gameAction: ability.actions.cardLastingEffect(() => ({
                    duration: 'untilEndOfTurn',
                    effect: ability.effects.addKeyword({ grouptactics: 2 })
                }))
            }
        });
    }
}

JoinTheHunt.id = 'join-the-hunt';

module.exports = JoinTheHunt;
