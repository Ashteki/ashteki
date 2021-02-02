const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class SilverSnake extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: [ability.effects.setPrintedAttack(() => this.status)]
        });

        this.forcedReaction({
            inexhaustible: true,
            title: 'Consume',
            autoResolve: true,
            when: {
                onCardDestroyed: (event, context) =>
                    event.clone.controller !== context.player &&
                    BattlefieldTypes.includes(event.clone.type)
            },
            effect: 'gain 1 status token from consume',
            gameAction: ability.actions.addStatusToken()
        });
    }
}

SilverSnake.id = 'silver-snake';

module.exports = SilverSnake;
