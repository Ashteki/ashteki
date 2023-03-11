const Card = require('../../Card.js');
const { BattlefieldTypes } = require('../../../constants');

class BloodPuppeteer extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            gameAction: this.game.actions.summon({
                conjuration: 'blood-puppet'
            })
        });

        this.destroyed({
            may: 'discard a blood puppet to gift a blood puppet',
            target: {
                activePromptTitle: 'Choose a blood puppet you control to discard',
                optional: true,
                cardType: BattlefieldTypes,
                cardCondition: (card) => card.id === 'blood-puppet',
                controller: 'self',
                gameAction: ability.actions.discard()
            },
            then: {
                target: {
                    toSelect: 'player',
                    autoTarget: (context) => context.player.opponent,
                    gameAction: this.game.actions.summon({
                        conjuration: 'blood-puppet'
                    })
                }
            }
        });
    }
}

BloodPuppeteer.id = 'blood-puppeteer';

module.exports = BloodPuppeteer;
