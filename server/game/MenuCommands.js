const { BattlefieldTypes } = require('../constants');
const GameActions = require('./GameActions');

class MenuCommands {
    static cardMenuClick(menuItem, game, player, card) {
        switch (menuItem.command) {
            case 'addDamage':
                game.addAlert('danger', '{0} adds a damage to {1}', player, card);
                card.addToken('damage', 1);
                break;
            case 'remDamage':
                game.addAlert('danger', '{0} removes a damage from {1}', player, card);
                card.removeToken('damage', 1);
                break;
            case 'addExhaustion':
                game.addAlert('danger', '{0} adds an exhaustion to {1}', player, card);
                card.addToken('exhaustion', 1);
                break;
            case 'remExhaustion':
                game.addAlert('danger', '{0} removes an exhaustion from {1}', player, card);
                card.removeToken('exhaustion', 1);
                break;
            case 'addStatus':
                game.addAlert('danger', '{0} adds a status to {1}', player, card);
                card.addToken('status', 1);
                break;
            case 'remStatus':
                game.addAlert('danger', '{0} removes a status from {1}', player, card);
                card.removeToken('status', 1);
                break;
            case 'addGravityFlux':
                game.addAlert('danger', '{0} adds gravity flux exhaustion to {1}', player, card);
                card.addToken('gravityFlux', 1);
                break;
            case 'remGravityFlux':
                game.addAlert('danger', '{0} removes gravity flux exhaustion from {1}', player, card);
                card.removeToken('gravityFlux', 1);
                break;
            case 'remEffects':
                game.addAlert('danger', '{0} removes temporary effects from {1}', player, card);
                card.removeLastingEffects();
                break;
            // I can't click on cards in my Discard pile in manual mode and receive a menu
            // In manual mode, I can't click on cards in hand and receive a menu (drag & drop required)
            case 'moveHand':
                if (
                    card.controller != player.opponent &&
                    ((card.location === 'play area' && card.type != 'phoenixborn') ||
                        card.location === 'spellboard' ||
                        card.location === 'discard')
                ) {
                    game.addAlert('danger', '{0} moves {1} from their {2} to their hand', player, card, card.location);
                    card.owner.moveCard(card, 'hand');
                }
                break;
            case 'moveDiscard':
                if (
                    card.controller != player.opponent &&
                    ((card.location === 'play area' && card.type != 'phoenixborn') ||
                        card.location === 'spellboard' ||
                        card.location === 'hand')
                ) {
                    game.addAlert('danger', '{0} moves {1} from their {2} to their discard pile', player, card, card.location);
                    card.owner.moveCard(card, 'discard');
                }
                break;
            case 'movePlay':
                if (
                    card.controller != player.opponent &&
                    (card.location === 'hand' || card.location === 'discard')
                ) {
                    game.addAlert('danger', '{0} moves {1} from their {2} to play', player, card, card.location);
                    card.owner.moveCard(card, 'play area');
                }
                break;
            case 'moveConjuration':
                if (card.controller != player.opponent && card.location === 'play area') {
                    game.addAlert('danger', '{0} moves {1} from their {2} to their conjuration pile', player, card, card.location);
                    card.owner.moveCard(card, 'archives');
                }
                break;
            case 'control':
                if (card.controller != player.opponent) {
                    game.takeControl(player.opponent, card);
                    card.setDefaultController(player.opponent);
                    game.addAlert(
                        'danger',
                        '{0} gives {1} control of {2}',
                        player,
                        player.opponent,
                        card
                    );
                }
                break;
            case 'guarded':
                card.usedGuardThisRound = !card.usedGuardThisRound;
                game.addAlert(
                    'danger',
                    "{0} sets {1}'s guarded status to {2}",
                    player,
                    card,
                    card.usedGuardThisRound ? 'true' : 'false'
                );
                break;
            case 'detachDie':
                if (card.dieUpgrades.length === 1) {
                    player.removeDieAttachments(card);
                    game.addAlert(
                        'danger',
                        '{0} removes {1} from {2}',
                        player,
                        card.dieUpgrades[0],
                        card
                    );
                    return true;
                }
                break;
            case 'attach':
                game.promptForSelect(player, {
                    activePromptTitle: 'Select a card to attach to',
                    waitingPromptTitle: 'Waiting for opponent to attach a card',
                    cardCondition: (c) => c.location === 'play area',
                    onSelect: (player, c) => {
                        GameActions.attach({
                            target: c,
                            upgrade: card
                        }).resolve(card, game.getFrameworkContext(player));

                        game.addAlert('danger', '{0} attaches {1} to {2}', player, card, c);
                        return true;
                    }
                });
                break;
        }
    }

    static dieMenuClick(menuItem, game, player, die) {
        switch (menuItem.command) {
            case 'exhaust':
                if (die.exhausted) {
                    game.addAlert('danger', '{0} readies {1}', player, die.name);
                    die.ready();
                } else {
                    game.addAlert('danger', '{0} exhausts {1}', player, die.name);
                    die.exhaust();
                }
                break;
            case 'raise':
                game.addAlert('danger', '{0} raises {1}', player, die.name);
                die.raise();
                break;
            case 'lower':
                game.addAlert('danger', '{0} lowers {1}', player, die.name);
                die.lower();
                break;
            case 'attach':
                game.promptForSelect(player, {
                    activePromptTitle: 'Select a card',
                    waitingPromptTitle: 'Waiting for opponent to attach die',
                    cardCondition: (card) =>
                        card.location === 'play area' || card.location === 'spellboard',
                    onSelect: (p, card) => {
                        GameActions.attachDie({
                            target: card,
                            upgradeDie: die
                        }).resolve(die, game.getFrameworkContext(player));

                        game.addAlert('danger', '{0} attaches {1} to {2}', p, die, card);
                        return true;
                    }
                });

                break;
            case 'detach':
                player.removeDieAttachments(die.parent);
                break;
        }
    }
}

module.exports = MenuCommands;
