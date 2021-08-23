const { Level, BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class GorrenrockBrawler extends Card {
    setupCardAbilities(ability) {
        this.action({
            inexhaustible: true,
            title: 'Comeback',
            condition: (context) => context.source.allTokenCount() >= 6,
            cost: [ability.costs.mainAction(), ability.costs.dice([new DiceCount(1, Level.Basic)])],
            gameAction: ability.actions.removeAllTokens()
        });

        this.forcedReaction({
            inexhaustible: true,
            autoResolve: true,

            title: 'Brawl 1',
            when: {
                onCardDestroyed: (event, context) =>
                    BattlefieldTypes.includes(event.card.type) &&
                    (context.source.wasAttacker || context.source.wasDefender)
            },
            gameAction: ability.actions.addStatusToken()
        });
    }
}

GorrenrockBrawler.id = 'gorrenrock-brawler';

module.exports = GorrenrockBrawler;
