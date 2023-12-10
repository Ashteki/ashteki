const { Magic } = require('../../../constants.js');
const Card = require('../../Card.js');

class ChimeraCharmer extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            title: 'Subdue',
            target: {
                activePromptTitle: 'Choose an exhausted Charm die to resolve its die power',
                optional: true,
                toSelect: 'die',
                owner: 'self',
                dieCondition: (die) => die.magic === Magic.Charm && die.exhausted,
                gameAction: ability.actions.resolveDieAbility()
            }
        });

        this.persistentEffect({
            match: this,
            effect: ability.effects.modifyAttack((c) => this.getOpponentCharmedUnits(c))
        });
    }

    getOpponentCharmedUnits(card) {
        return card.controller.opponent.unitsInPlay.filter((c) => c.hasCharmDie).length;
    }
}

ChimeraCharmer.id = 'chimera-charmer';

module.exports = ChimeraCharmer;
