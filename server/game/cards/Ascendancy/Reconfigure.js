const { Magic } = require('../../../constants.js');
const Card = require('../../Card.js');

class Reconfigure extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reconfigure',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            location: 'spellboard',
            targets: {
                chosenDie: {
                    activePromptTitle: 'Choose an Artifice die to move',
                    optional: true,
                    toSelect: 'die',
                    owner: 'self',
                    dieCondition: (die) => die.magic === Magic.Artifice && die.parent
                },
                targetCard: {
                    dependsOn: 'chosenDie',
                    activePromptTitle: 'Choose a card to move the die to',
                    controller: 'self',
                    optional: true,
                    gameAction: ability.actions.attachDie((context) => ({
                        target: context.targets.targetCard,
                        upgradeDie: context.targets.chosenDie
                    }))
                }
            }
        });
    }
}

Reconfigure.id = 'reconfigure';

module.exports = Reconfigure;
