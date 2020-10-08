class MenuCommands {
    static cardMenuClick(menuItem, game, player, card) {
        switch (menuItem.command) {
            case 'exhaust':
                if (card.exhausted) {
                    game.addAlert(
                        'danger',
                        '{0} removes an exhaustion token from {1}',
                        player,
                        card
                    );
                    card.ready();
                } else {
                    game.addAlert('danger', '{0} adds and eshaustion token to {1}', player, card);
                    card.exhaust();
                }

                break;
            case 'addDamage':
                game.addAlert('danger', '{0} adds a damage to {1}', player, card);
                card.addToken('damage', 1);
                break;
            case 'remDamage':
                game.addAlert('danger', '{0} removes a damage from {1}', player, card);
                card.removeToken('damage', 1);
                break;
            case 'addAmber':
                game.addAlert('danger', '{0} adds an amber to {1}', player, card);
                card.addToken('amber', 1);
                break;
            case 'remAmber':
                game.addAlert('danger', '{0} removes an amber from {1}', player, card);
                card.removeToken('amber', 1);
                break;
            case 'addWard':
                game.addAlert('danger', '{0} adds a ward to {1}', player, card);
                card.addToken('ward', 1);
                break;
            case 'remWard':
                game.addAlert('danger', '{0} removes a ward from {1}', player, card);
                card.removeToken('ward', 1);
                break;
            case 'control':
                if (player.opponent) {
                    game.addAlert(
                        'danger',
                        '{0} gives {1} control of {2}',
                        player,
                        player.opponent,
                        card
                    );
                    card.setDefaultController(player.opponent);
                }

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
        }
    }
}

module.exports = MenuCommands;
