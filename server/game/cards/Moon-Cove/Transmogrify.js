const { BattlefieldTypes, UpgradeCardTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Transmogrify extends Card {
    setupCardAbilities(ability) {
        this.play({
            targets: {
                unit: {
                    activePromptTitle: 'Choose a target unit with an alteration',
                    cardType: BattlefieldTypes,
                    controller: 'any',
                    cardCondition: (card) => card.upgrades.length > 0
                },
                alteration: {
                    dependsOn: 'unit',
                    activePromptTitle: 'Choose an alteration',
                    cardType: UpgradeCardTypes,
                    cardCondition: (card, context) => card.parent === context.targets.unit
                },
                destination: {
                    dependsOn: 'alteration',
                    activePromptTitle: 'Choose a unit to move the alteration to',
                    cardType: BattlefieldTypes,
                    controller: (context) =>
                        context.targets.unit.controller === context.player.opponent
                            ? 'opponent'
                            : 'self',
                    cardCondition: (card, context) => card !== context.targets.unit,
                    gameAction: ability.actions.attach((context) => ({
                        // target: context.source,
                        upgrade: context.targets.alteration,
                        canTakeUpgradeInPlay: true
                    }))
                }
            }
        });
    }
}

Transmogrify.id = 'transmogrify';

module.exports = Transmogrify;
