const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class DreamFracture extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Dream Fracture',
            cost: [ability.costs.mainAction(), ability.costs.exhaust()],
            location: 'spellboard',
            //todo: this isn't right - need to target a player then select from their dice
            target: {
                activePromptTitle: 'Choose a die to lower',
                condition: (context) =>
                    !context.player.checkRestrictions('changeOpponentsDice') &&
                    context.player.opponent.dice.some((d) => !d.exhausted),
                toSelect: 'die',
                owner: 'opponent',
                gameAction: ability.actions.lowerDie()
            },
            then: {
                condition: (context) =>
                    !context.player.opponent.dice.some((d) => d.level === 'power'),
                cardType: [...CardType.Phoenixborn],
                controller: 'opponent',
                gameAction: ability.actions.dealDamage({ showMessage: true })
            }
        });
    }
}

DreamFracture.id = 'dream-fracture';

module.exports = DreamFracture;
