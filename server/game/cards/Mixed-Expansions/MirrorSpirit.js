const Card = require('../../Card.js');

class MirrorSpirit extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: [ability.effects.setPrintedAttack(() => this.status)]
        });

        this.entersPlay({
            target: {
                mode: 'select',
                activePromptTitle: "Reflect Sorrow: Choose which player's units",
                choices: [
                    { text: 'Mine', value: false },
                    { text: "Opponent's", value: true }
                ],
                choiceHandler: (option) => (this.chosenValue = option.value)
            },
            gameAction: ability.actions.addStatusToken((context) => ({
                target: context.source,
                amount: this.getTokenCount(context)
            }))
        });
    }

    getTokenCount(context) {
        const player = this.chosenValue ? context.player.opponent : context.player;
        return player.unitsInPlay.reduce((acc, u) => acc + u.exhaustion, 0);
    }
}

MirrorSpirit.id = 'mirror-spirit';

module.exports = MirrorSpirit;
