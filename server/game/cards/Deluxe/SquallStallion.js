const Card = require('../../Card.js');

class SquallStallion extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            title: 'LightningSpeed',
            condition: () => !this.exhausted,
            match: this,
            effect: ability.effects.cannotBeReactionTarget()
        });

        this.persistentEffect({
            effect: [ability.effects.setPrintedAttack(() => this.status)]
        });

        this.action({
            inexhaustible: true,
            title: 'Torrent',
            cost: [ability.costs.sideAction()],
            targets: {
                myCard: {
                    activePromptTitle: 'Choose a card to return to your deck',
                    controller: 'self',
                    location: 'hand',
                    optional: true
                },
                action: {
                    mode: 'select',
                    dependsOn: 'myCard',
                    player: 'self',
                    activePromptTitle: 'Choose where to return it to',
                    choices: {
                        Top: this.game.actions.returnToDeck((context) => ({
                            target: context.targets.myCard,
                            reveal: false,
                            shuffle: false
                        })),
                        Bottom: this.game.actions.returnToDeck((context) => ({
                            bottom: true,
                            reveal: false,
                            target: context.targets.myCard,
                            shuffle: false
                        }))
                    }
                }
            },
            then: {
                // add a status to all squall stallions
                gameAction: ability.actions.addStatusToken((context) => ({
                    target: context.player.unitsInPlay.filter((u) => u.name === this.name)
                }))
            }
        });
    }
}

SquallStallion.id = 'squall-stallion';

module.exports = SquallStallion;
