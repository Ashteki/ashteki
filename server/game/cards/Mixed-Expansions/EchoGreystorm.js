const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class EchoGreystorm extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Gravity Flux',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            target: {
                cardType: BattlefieldTypes,
                gameAction: ability.actions.exhaustGravityFlux()
            }
        });
        this.forcedInterrupt({
            autoResolve: true,
            title: 'Remove Gravity Flux Tokens', // I need to remove the effect message
            inexhaustible: true,
            when: {
                onTurnEnded: () => true
            },
            gameAction: ability.actions.removeToken((context) => ({
                all: true,
                type: 'gravityFlux',
                target: context.game.cardsInPlay.filter((card) => card.hasToken('gravityFlux'))
            }))
        });
    }
}

EchoGreystorm.id = 'echo-greystorm';

module.exports = EchoGreystorm;