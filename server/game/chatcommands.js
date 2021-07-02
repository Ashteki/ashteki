const _ = require('underscore');
const GameActions = require('./GameActions');
const ManualModePrompt = require('./gamesteps/ManualModePrompt');
const Deck = require('./deck');
const RematchPrompt = require('./gamesteps/RematchPrompt');
const { CardType } = require('../constants');

class ChatCommands {
    constructor(game) {
        this.game = game;
        this.commands = {
            '/add-card': this.addCard,
            '/cancel-prompt': this.cancelPrompt,
            '/conj': this.moveConjuration,
            '/conjuration': this.moveConjuration,
            '/disconnectme': this.disconnectMe,
            '/draw': this.draw,
            '/discard': this.discard,
            '/discardtopofdeck': this.discardtopofdeck,
            '/manual': this.manual,
            '/modify-clock': this.modifyClock,
            '/mute-spectators': this.muteSpectators,
            '/purge': this.purgeCard,
            '/rematch': this.rematch,
            '/shuffle': this.shuffle,
            '/stop-clocks': this.stopClocks,
            '/start-clocks': this.startClocks,
            '/token': this.setToken
        };
        this.tokens = ['damage', 'exhaust', 'status'];
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
        this.game.addAlert('danger', '{0} sets their {1} action to unspent', player, actionType);
        player.actions[actionType] = true;
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
        GameActions.chosenDiscard({ amount: num }).resolve(
            player,
            this.game.getFrameworkContext(player)
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
            this.game.getFrameworkContext(player)
        );
    }

    shuffle(player) {
        this.game.addAlert('danger', '{0} is shuffling their deck', player);
        player.shuffleDeck();
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

    moveConjuration(player) {
        this.game.promptForSelect(player, {
            location: 'archives',
            cardType: CardType.Conjuration,
            controller: 'self',
            activePromptTitle: 'Select a card',
            onSelect: (player, card) => {
                this.game.addAlert('danger', '{0} manually moves {1} into play', player, card);
                GameActions.moveCard({
                    destination: 'play area'
                }).resolve(card, this.game.getFrameworkContext(player));
                return true;
            }
        });
    }

    purgeCard(player) {
        this.game.promptForSelect(player, {
            controller: 'self',
            activePromptTitle: 'Select a card to remove from the game',
            onSelect: (player, card) => {
                this.game.addAlert(
                    'danger',
                    '{0} manually removes {1} from the game',
                    player,
                    card
                );
                GameActions.purge().resolve(card, this.game.getFrameworkContext(player));
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
