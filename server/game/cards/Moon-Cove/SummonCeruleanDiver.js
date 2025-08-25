const { Level, Magic, BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonCeruleanDiver extends Card {
    setupCardAbilities(ability) {
        this.preventAutoDice = true;

        this.action({
            title: 'Summon Cerulean Diver',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Sympathy)])
            ],
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'cerulean-diver'
            }),
            then: (context) => {
                let diceCost = context.costs.returnDice;
                const power = diceCost.some((d) => d.level === Level.Power);
                if (power && context.source.focus > 0) {
                    return {
                        alwaysTriggers: true,

                        target: {
                            showCancel: true,
                            controller: 'opponent',
                            activePromptTitle: 'Choose a unit to deal 1 damage to',
                            cardType: BattlefieldTypes,
                            gameAction: ability.actions.dealDamage()
                        }
                    }
                } else {
                    return undefined;
                }
            }
        });
    }
}

SummonCeruleanDiver.id = 'summon-cerulean-diver';

module.exports = SummonCeruleanDiver;
