const Card = require('../../Card.js');

class MirrorSpirit extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: [ability.effects.setPrintedAttack(() => this.status)]
        });

        this.entersPlay({
            target: {
                mode: 'options',
                activePromptTitle: "Which player's battlefield?",
                options: [
                    { name: 'Mine', value: false },
                    { name: "Opponent's", value: true }
                ],
                handler: (option) => (this.chosenValue = option.value)
            },
            gameAction: ability.actions.addStatusToken((context) => ({
                target: context.source,
                amount: this.chosenValue
                    ? context.player.opponent.unitsInPlay.filter((c) => c.exhausted).length
                    : context.player.unitsInPlay.filter((c) => c.exhausted).length
            }))
        });
    }
}

MirrorSpirit.id = 'mirror-spirit';

module.exports = MirrorSpirit;
