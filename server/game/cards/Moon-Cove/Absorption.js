const { BattlefieldTypes, PhoenixbornTypes, Level } = require('../../../constants.js');
const Card = require('../../Card.js');

class Absorption extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onDamageApplied: (event, context) =>
                    [...BattlefieldTypes, ...PhoenixbornTypes].includes(event.card.type) &&
                    event.card.controller === context.player
            },
            effect: 'prevent damage',
            target: {
                toSelect: 'die',
                mode: 'upTo',
                numDice: 2,
                dieCondition: (die) => !die.exhausted && die.level !== Level.Basic,
                owner: 'self',
                gameAction: ability.actions.lowerDie()
            },
            then: {
                gameAction: ability.actions.preventDamage((context) => ({
                    event: context.preThenEvent.context.event,
                    amount: context.preThenEvent.context.target.length // numDice
                }))
            }
        });
    }
}

Absorption.id = 'absorption';

module.exports = Absorption;
