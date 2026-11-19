const { CardType, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');

class ScrapHound extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onAttackersDeclared: (event, context) =>
                    // I'm the attacker
                    event.attackers.includes(context.source)
            },
            target: {
                toSelect: 'die',
                autoTarget: (context) =>
                    context.player.findDie((die) => die.magic === Magic.Artifice && die.exhausted),
                gameAction: ability.actions.resolveDieAbility((context) => ({
                    targetCardType: CardType.ReadySpell
                }))
            }
        });

        this.persistentEffect({
            match: this,
            condition: () => this.upgrades.length > 0,
            effect: ability.effects.modifyAttack(() => this.getAbilityNumeric(1))
        });
    }
}

ScrapHound.id = 'scrap-hound';

module.exports = ScrapHound;
