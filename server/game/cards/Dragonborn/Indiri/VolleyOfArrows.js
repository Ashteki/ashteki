const AspectCard = require('../../../solo/AspectCard');

class VolleyOfArrows extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.statusAbility({
            title: 'Volley of Arrows',
            log: 'each',
            gameAction: ability.actions.conditional({
                condition: (context) => context.player.archives.some((c) => c.id.includes('arrow')),
                trueGameAction: ability.actions.summon((context) => ({
                    conjuration: this.getRandomArrow(context)
                }))
            })
        });
    }

    getRandomArrow(context) {
        const arrows = context.player.archives.filter((c) => c.id.includes('arrow'));
        const randomIndex = Math.floor(Math.random() * arrows.length);
        return arrows[randomIndex].id;
    }
}

VolleyOfArrows.id = 'volley-of-arrows';

module.exports = VolleyOfArrows;
