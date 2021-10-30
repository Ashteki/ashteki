const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class SummonSpectralAssassin extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Summon Spectral Assassin',
            target: {
                controller: 'self',
                cardType: CardType.Ally,
                gameAction: ability.actions.returnToHand()
            },
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.chooseAction((context) => ({
                    target: context.player,
                    choices: this.getChoices(ability, context)
                }))
            }
        });
    }
    getChoices(ability, context) {
        const choices = {
            SummonAndDraw: [
                ability.actions.summon({
                    conjuration: 'spectral-assassin'
                }),
                ability.actions.draw({ showMessage: true })
            ],
            SummonOnly: ability.actions.summon({
                conjuration: 'spectral-assassin'
            }),
            Draw: ability.actions.playerChosenAmountDraw((context) => ({
                target: context.player,
                amount: 1,
                showMessage: true
            }))
        };

        if (context && context.preThenEvent) {
            delete choices.Draw;
        } else {
            delete choices.SummonAndDraw;
            delete choices.SummonOnly;
        }

        return choices;
    }
}

SummonSpectralAssassin.id = 'summon-spectral-assassin';

module.exports = SummonSpectralAssassin;
