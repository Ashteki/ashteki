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
