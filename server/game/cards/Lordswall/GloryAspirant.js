const { CardType, Magic, Level } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCost = require('../../Costs/dicecost.js');

class GloryAspirant extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            title: 'Armed',
            target: {
                activePromptTitle: 'Choose a divine power cost card to place in your hand',
                optional: true,
                controller: 'self',
                cardCondition: (card) =>
                    card.playCost.some(
                        (pc) =>
                            pc instanceof DiceCost &&
                            pc.diceReq.some(
                                (req) => req.level === Level.Power && req.magic === Magic.Divine
                            )
                    ),
                location: ['deck'],
                gameAction: ability.actions.moveCard({
                    destination: 'hand',
                    shuffle: true
                })
            },
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.changeDice({
                    dieCondition: (die) => !die.exhausted && die.magic === Magic.Divine,
                    numDice: 1,
                    owner: 'self'
                })
            }
        });
    }
}

GloryAspirant.id = 'glory-aspirant';

module.exports = GloryAspirant;
