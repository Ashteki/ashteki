const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class JerichoReborn extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Prepare',
            cost: [
                ability.costs.sideAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Time)])
            ],
            target: {
                // target a card in draw pile
                location: 'deck',
                gameAction: [
                    ability.actions.purge(),
                    ability.actions.shuffleDeck(),
                    ability.actions.moveCard({ destination: 'deck', shuffle: false })
                ]
            },
            effect: 'find a card in their deck, shuffle, then place that card on top of their deck'
        });
    }
}

JerichoReborn.id = 'jericho-reborn';

module.exports = JerichoReborn;
