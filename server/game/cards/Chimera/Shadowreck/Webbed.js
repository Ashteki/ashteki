const Card = require('../../../Card.js');
const { Level } = require('../../../../constants.js');

class Webbed extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.webbed(),
                ability.effects.modifyAttack(-1),
                ability.effects.modifyRecover(-1)
            ]
        });

        this.action({
            title: 'Untangle',
            cost: ability.costs.sideAction(),
            target: {
                toSelect: 'die',
                autoTarget: (context) =>
                    context.player.opponent.dice.filter((d) => d.level === Level.Basic).slice(0, 2),
                gameAction: ability.actions.rerollDice()
            },
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.discard()
            }
        });
    }
}

Webbed.id = 'webbed';

module.exports = Webbed;
