const _ = require('underscore');
const Constants = require('../constants.js');
const GameActions = require('./GameActions');
const ManualModePrompt = require('./gamesteps/ManualModePrompt');
const Deck = require('./deck');
const RematchPrompt = require('./gamesteps/RematchPrompt');

class ChatCommands {
    constructor(game) {
        this.game = game;
        this.commands = {
            '/add-card': this.addCard,
            '/cancel-prompt': this.cancelPrompt,
            '/disconnectme': this.disconnectMe,
            '/draw': this.draw,
            '/discard': this.discard,
            '/discardtopofdeck': this.discardtopofdeck,
            '/forge': this.forge,
            '/manual': this.manual,
            '/modify-clock': this.modifyClock,
            '/mulligan': this.mulligan,
            '/mute-spectators': this.muteSpectators,
            '/rematch': this.rematch,
            '/shuffle': this.shuffle,
            '/stop-clocks': this.stopClocks,
            '/start-clocks': this.startClocks,
            '/token': this.setToken,
            '/unforge': this.unforge
        };
        this.tokens = ['amber', 'damage', 'enrage', 'power', 'stun', 'ward'];
        this.houses = [...Constants.Houses, 'none'];
    }

    executeCommand(player, command, args) {
        if (!player || !this.commands[command]) {
            return false;
        }

        return this.commands[command].call(this, player, args) !== false;
    }

    addCard(player, args) {
        let location = 'hand';

        switch (args[1]) {
            case 'hand':
                location = 'hand';
                args = args.slice(1);

                break;
            case 'deck':
                location = 'deck';
                args = args.slice(1);

                break;
        }

        let cardName = args.slice(1).join(' ').toLowerCase();
        let card = this.game.cardData[cardName];
        if (!card) {
            card = Object.values(this.game.cardData).find((c) => c.name.toLowerCase() === cardName);
        }

        if (!card) {
            return false;
        }

        let deck = new Deck();
        let preparedCard = deck.createCard(player, card);
        if (preparedCard) {
            preparedCard.setupAbilities();
            preparedCard.location = 'deck';
        }

        preparedCard.applyAnyLocationPersistentEffects();

        player.moveCard(preparedCard, location);

        this.game.allCards.push(preparedCard);

        this.game.addAlert(
            'danger',
            '{0} uses the /add-card command to add {1} to their {2}',
            player,
            preparedCard,
            location
        );

        return true;
    }

    forge(player, args) {
        if (Object.values(player.keys).every((key) => key)) {
            return;
        }

        const color = args[1]
            ? args[1]
            : Object.keys(player.keys).filter((key) => !player.keys[key])[0];
        this.game.addAlert('danger', '{0} forges the {1} ', player, `forgedkey${color}`);
        player.keys[color] = true;
        player.keysForgedThisRound.push(color);
    }

    unforge(player, args) {
        if (Object.values(player.keys).every((key) => !key)) {
            return;
        }

        const color = args[1]
            ? args[1]
            : Object.keys(player.keys).filter((key) => player.keys[key])[0];
        this.game.addAlert('danger', '{0} unforges the {1}', player, `unforgedkey${color}`);
        player.keys[color] = false;
        let forgedKeyIndex = player.keysForgedThisRound.findIndex((key) => key === color);
        if (forgedKeyIndex !== -1) {
            player.keysForgedThisRound.splice(forgedKeyIndex, 1);
        }
    }

    spendAction(player, args) {
        if (Object.values(player.actions).every((action) => !action)) {
            return;
        }

        const actionType = args[1]
            ? args[1]
            : Object.keys(player.actions).filter((action) => !player.actions[action])[0];
        this.game.addAlert('danger', '{0} sets their {1} action to spent', player, `${actionType}`);
        player.actions[actionType] = false;
    }

    unSpendAction(player, args) {
        if (Object.values(player.actions).every((action) => action)) {
            return;
        }

        const actionType = args[1]
            ? args[1]
            : Object.keys(player.actions).filter((action) => player.actions[action])[0];
        this.game.addAlert(
            'danger',
            '{0} sets their {1} action to unspent',
            player,
            `unspendAction${actionType}`
        );
        player.actions[actionType] = true;
        // let forgedKeyIndex = player.keysForgedThisRound.findIndex((action) => action === actionType);
        // if (forgedKeyIndex !== -1) {
        //     player.keysForgedThisRound.splice(forgedKeyIndex, 1);
        // }
    }

    startClocks(player) {
        this.game.addAlert('danger', '{0} restarts the timers', player);
        _.each(this.game.getPlayers(), (player) => player.clock.restart());
    }

    stopClocks(player) {
        this.game.addAlert('danger', '{0} stops the timers', player);
        _.each(this.game.getPlayers(), (player) => player.clock.pause());
    }

    modifyClock(player, args) {
        let num = this.getNumberOrDefault(args[1], 60);
        this.game.addAlert('danger', '{0} adds {1} seconds to their clock', player, num);
        player.clock.modify(num);
    }

    draw(player, args) {
        let num = this.getNumberOrDefault(args[1], 1);
        this.game.addAlert('danger', '{0} draws {1} cards to their hand', player, num);
        player.drawCardsToHand(num);
    }

    discard(player, args) {
        let num = this.getNumberOrDefault(args[1], 1);
        this.game.addAlert(
            'danger',
            '{0} discard{2} {1} card{2} at random',
            player,
            num,
            num > 1 ? 's' : ''
        );
        GameActions.discardAtRandom({ amount: num }).resolve(
            player,
            this.game.getFrameworkContext()
        );
    }

    discardtopofdeck(player, args) {
        let num = this.getNumberOrDefault(args[1], 1);
        this.game.addAlert(
            'danger',
            '{0} discards {1} card{2} from top of deck',
            player,
            num,
            num > 1 ? 's' : ''
        );
        GameActions.discardTopOfDeck({ amount: num }).resolve(
            player,
            this.game.getFrameworkContext()
        );
    }

    shuffle(player) {
        this.game.addAlert('danger', '{0} is shuffling their deck', player);
        player.shuffleDeck();
    }

    mulligan(player) {
        this.game.addAlert('danger', '{0} mulligans their hand', player);
        player.takeMulligan();
    }

    cancelPrompt(player) {
        this.game.addAlert('danger', '{0} skips the current step.', player);
        this.game.pipeline.cancelStep();
        this.game.cancelPromptUsed = true;
    }

    setToken(player, args) {
        let token = args[1];
        let num = this.getNumberOrDefault(args[2], 1);

        if (!this.isValidToken(token)) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            waitingPromptTitle: 'Waiting for opponent to set token',
            cardCondition: (card) =>
                (card.location === 'play area' || card.location === 'spellboard') &&
                card.controller === player,
            onSelect: (p, card) => {
                let numTokens = card.tokens[token] || 0;
                card.addToken(token, num - numTokens);
                this.game.addAlert(
                    'danger',
                    '{0} uses the /token command to set the {1} token count of {2} to {3}',
                    p,
                    token,
                    card,
                    num - numTokens
                );
                return true;
            }
        });
    }

    reveal(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            cardCondition: (card) => card.facedown && card.controller === player,
            onSelect: (player, card) => {
                card.facedown = false;
                this.game.addAlert('danger', '{0} reveals {1}', player, card);
                return true;
            }
        });
    }

    disconnectMe(player) {
        player.socket.disconnect();
    }

    manual(player) {
        if (this.game.manualMode) {
            this.game.manualMode = false;
            this.game.addAlert('danger', '{0} switches manual mode off', player);
        } else {
            this.game.addAlert('danger', '{0} is attempting to switch manual mode on', player);
            this.game.queueStep(new ManualModePrompt(this.game, player));
        }
    }

    muteSpectators(player) {
        this.game.muteSpectators = !this.game.muteSpectators;

        this.game.addAlert(
            'warning',
            '{0} {1}mutes spectators',
            player,
            this.game.muteSpectators ? '' : 'un'
        );
    }

    getNumberOrDefault(string, defaultNumber) {
        let num = parseInt(string);

        if (isNaN(num)) {
            num = defaultNumber;
        }

        if (num < 0) {
            num = defaultNumber;
        }

        return num;
    }

    isValidToken(token) {
        if (!token) {
            return false;
        }

        let lowerToken = token.toLowerCase();

        return _.contains(this.tokens, lowerToken);
    }

    rematch(player) {
        if (this.game.finishedAt) {
            this.game.addAlert('info', '{0} is requesting a rematch', player);
        } else {
            this.game.addAlert(
                'danger',
                '{0} is requesting a rematch.  The current game is not finished',
                player
            );
        }

        this.game.queueStep(new RematchPrompt(this.game, player));
    }
}

module.exports = ChatCommands;
