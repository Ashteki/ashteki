const Card = require('../../Card.js');

class MirrorSpirit extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: [ability.effects.setPrintedAttack(() => this.status)]
        });

        this.entersPlay({
            target: {
                toSelect: 'player',
                activePromptTitle: "Which player's battlefield?",
                choices: ["Opponent's", 'Mine'],
                gameAction: ability.actions.addStatusToken((context) => ({
                    target: context.source,
                    amount: this.getTokenCount(context)
                }))
            }
        });
    }

    getTokenCount(context) {
        const player = context.target;
        const exhaustionTotal = player.unitsInPlay.reduce((acc, u) => acc + u.exhaustion, 0);
        const gravityFluxExhaustionTotal = player.unitsInPlay.reduce(
            (acc, u) => acc + u.exhaustionGravityFlux,
            0
        );
        return exhaustionTotal + gravityFluxExhaustionTotal;
    }
}

MirrorSpirit.id = 'mirror-spirit';

module.exports = MirrorSpirit;
