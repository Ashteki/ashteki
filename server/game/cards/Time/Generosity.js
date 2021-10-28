const { CardType, BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Generosity extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Generosity',
            effect: 'choose from 3 actions',
            gameAction: ability.actions.chooseAction((context) => ({
                target: context.player,
                choices: this.getChoices(ability, context.player, context)
            })),
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.chooseAction((context) => ({
                    target: context.player.opponent,
                    player: context.player.opponent,
                    choices: this.getChoices(ability, context.player.opponent, context)
                })),
                then: {
                    alwaysTriggers: true,
                    gameAction: ability.actions.chooseAction((context) => ({
                        target: context.player,
                        choices: this.getChoices(ability, context.player, context)
                    }))
                }
            }
        });
    }

    getChoices(ability, player, context) {
        const controller = context.player === player ? 'self' : 'opponent';
        const choices = {
            Unexhaust: ability.actions.removeExhaustion({
                amount: 1,
                promptForSelect: {
                    activePromptTitle:
                        'Remove 1 exhaustion token from a Phoenixborn or ready spell',
                    cardType: [CardType.ReadySpell, CardType.Phoenixborn],
                    controller,
                    player,
                    message: '{0} removes 1 exhaustion token from {1}',
                    messageArgs: (card) => [player, card]
                }
            }),
            Heal: ability.actions.removeDamage({
                amount: 2,
                promptForSelect: {
                    activePromptTitle: 'Remove 2 damage from a unit or Phoenixborn',
                    cardType: [...BattlefieldTypes, CardType.Phoenixborn],
                    controller,
                    player,
                    message: '{0} removes 2 wounds from {1}',
                    messageArgs: (card) => [player, card]
                }
            }),
            Draw: ability.actions.draw({ amount: 3, showMessage: true })
        };

        if (context && context.preThenEvent) {
            this.modifyChoices(choices, context.preThenEvent);
            if (context.preThenEvent.context && context.preThenEvent.context.preThenEvent) {
                this.modifyChoices(choices, context.preThenEvent.context.preThenEvent);
            }
        }

        return choices;
    }

    modifyChoices(choices, event) {
        if (event.amount === 1) {
            delete choices.Unexhaust;
        } else if (event.amount === 2) {
            delete choices.Heal;
        } else {
            delete choices.Draw;
        }
    }
}

Generosity.id = 'generosity';

module.exports = Generosity;
