const Card = require('../../Card.js');

class Adaptodon extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Adapt',
            cost: [ability.costs.sideAction()],
            condition: (context) =>
                !context.source.upgrades.some(
                    (u) => u.id === 'fire-adaptation' || u.id === 'ice-adaptation'
                ) &&
                context.player.archives.some(
                    (u) => u.id === 'fire-adaptation' || u.id === 'ice-adaptation'
                ),
            target: {
                activePromptTitle: 'Choose an adaptation:',
                mode: 'select',
                choices: {
                    Fire: (context) => context.player.archives.some((c) => c.id === 'fire-adaptation'),
                    Ice: (context) => context.player.archives.some((c) => c.id === 'ice-adaptation')
                }
            },
            gameAction: ability.actions.attachConjuredAlteration((context) => ({
                conjuredAlteration: context.select === 'Fire' ? 'fire-adaptation' : 'ice-adaptation',
                target: context.source
            }))
        });
    }
}

Adaptodon.id = 'adaptodon';

module.exports = Adaptodon;
