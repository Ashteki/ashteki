const Card = require('../../Card.js');

class Snapseed extends Card {
    setupCardAbilities(ability) {
        this.forcedInterrupt({
            autoResolve: true,
            inexhaustible: true,
            title: 'Wilt',
            when: {
                onRoundEnded: () => true
            },
            message: 'Wilt: {0} is discarded',
            messageArgs: (context) => context.source,
            condition: (context) => context.source.upgrades.length < 1,
            gameAction: ability.actions.discard((context) => ({
                card: context.source,
                showMessage: false
            }))
        });

        this.action({
            title: 'Solar Sprout',
            cost: ability.costs.mainAction(),
            gameAction: ability.actions.discard(),
            then: {
                condition: (context) => context.preThenEvent.clone.wasCharged,
                gameAction: ability.actions.summon({
                    conjuration: 'snaptrap'
                })
            }
        });
    }
}

Snapseed.id = 'snapseed';

module.exports = Snapseed;
