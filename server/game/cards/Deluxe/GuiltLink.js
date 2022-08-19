const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class GuiltLink extends Card {
    setupCardAbilities(ability) {
        this.forcedReaction({
            autoResolve: true,
            location: 'spellboard',
            when: {
                onAddToken: (event, context) =>
                    event.card == context.player.phoenixborn &&
                    // it's a wound
                    event.type == 'damage' &&
                    event.context.player == context.player.opponent &&
                    event.parentEvent &&
                    event.parentEvent.parentEvent &&
                    event.parentEvent.parentEvent.fightEvent &&
                    event.card.damage < event.card.life
            },
            condition: (context) => context.source.status == 0,
            gameAction: ability.actions.addStatusToken((context) => ({
                amount: 1,
                target: context.source
            }))
        });

        this.action({
            title: 'Guilt Link',
            location: 'spellboard',
            cost: [ability.costs.sideAction(), ability.costs.exhaust(), ability.costs.loseStatus()],
            target: {
                cardType: BattlefieldTypes,
                controller: 'self',
                gameAction: ability.actions.destroy()
            },
            then: {
                // To Do: Technically a player could select themselves if they wanted
                // to clear 2 units from their battlefield, so there should be a target player
                gameAction: ability.actions.chosenDestroy({
                    player: this.controller.opponent
                })
            }
        });
    }
}

GuiltLink.id = 'guilt-link';

module.exports = GuiltLink;
