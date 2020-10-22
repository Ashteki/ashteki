const Card = require('../../Card.js');

class MaeoniViper extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Command Strike',
            cost: [
                ability.costs.sideAction(),
                ability.costs.exhaust(),
                ability.costs.dice([{ level: 'basic' }, { level: 'basic' }])
            ],
            targets: {
                myChar: {
                    cardType: ['Ally', 'Conjuration'],
                    controller: 'self',
                    cardCondition: (card) => !card.exhausted
                },
                oppChar: {
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
