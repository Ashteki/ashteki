const Card = require('../../Card.js');

class ImmortalCommander extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Command 1',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            gameAction: ability.actions.cardLastingEffect((context) => ({
                duration: 'untilEndOfTurn',
                effect: ability.effects.modifyAttack(1),
                target: context.player.unitsInPlay.filter((c) => c !== context.source)
            }))
        });
    }
}

ImmortalCommander.id = 'immortal-commander';

module.exports = ImmortalCommander;
