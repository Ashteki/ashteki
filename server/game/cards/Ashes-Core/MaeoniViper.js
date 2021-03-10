const { Level } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class MaeoniViper extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Command Strike',
            condition: (context) =>
                context.player.unitsInPlay.filter((u) => !u.exhausted).length > 0 &&
                context.player.opponent.unitsInPlay.length > 0,
            cost: [
                ability.costs.sideAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(2, Level.Basic)])
            ],
            targets: {
                myChar: {
                    activePromptTitle: 'Choose an unexhausted unit.',
                    cardType: ['Ally', 'Conjuration'],
                    controller: 'self',
                    cardCondition: (card) => !card.exhausted
                },
                oppChar: {
                    dependsOn: 'myChar',
                    activePromptTitle: 'Choose a unit to damage',
                    cardType: ['Ally', 'Conjuration'],
                    controller: 'opponent',
                    gameAction: ability.actions.dealDamage((context) => ({
                        amount: context.targets.myChar.attack
                    }))
                }
            }
        });
    }
}

MaeoniViper.id = 'maeoni-viper';

module.exports = MaeoniViper;
