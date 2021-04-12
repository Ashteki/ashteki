const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class EchoGreystorm extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Gravity Flux',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            target: {
                cardType: BattlefieldTypes,
                gameAction: ability.actions.exhaust({
                    postHandler: (context) => {
                        context.game.addAlert(
                            'danger',
                            'Gravity flux exhaustion token must be removed using MANUAL MODE'
                        );
                    }
                })
            }
        });
    }
}

EchoGreystorm.id = 'echo-greystorm';

module.exports = EchoGreystorm;
