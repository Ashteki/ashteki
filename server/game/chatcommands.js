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
            '/addcard': this.addCard, // hidden option (that is, not in About.jsx)
            '/cancelprompt': this.cancelPrompt,
            '/conj': this.moveConjuration, // hidden option
            '/conjuration': this.moveConjuration,
            '/disconnectme': this.disconnectMe, // hidden option
            '/draw': this.draw,
            '/discard': this.discard,
            '/discardfromdeck': this.discardtopofdeck,
            '/givecontrol': this.giveControl,
            '/manual': this.manual,
            '/move': this.moveCard,
            '/modifyclock': this.modifyClock, // hidden option
            '/mutespectators': this.muteSpectators, // hidden option
            '/passactive': this.passActiveTurn, //hidden option
            '/purge': this.purgeCard,
            '/rematch': this.rematch,
            '/removeeffects': this.removeEffects,
            '/reveal': this.reveal,
            '/shuffle': this.shuffle,
            '/stopclocks': this.stopClocks, // hidden option
            '/startclocks': this.startClocks, // hidden option
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
            '{0} uses the /addcard command to add {1} to their {2}',
            player,
            preparedCard,
            location
        );

        return true;
    }

    giveControl(player) {
        this.game.promptForSelect(player, {
            location: 'play area',
            cardType: ['Ally', 'Conjuration'],
            controller: 'self',
            activePromptTitle: 'Select a card',
            onSelect: (player, card) => {
                this.game.addAlert(
                    'danger',
                    '{0} gives {1} control of {2}',
                    player,
                    player.opponent,
                    card
                );
                this.game.takeControl(player.opponent, card);
                card.setDefaultController(player.opponent);
                return true;
            }
        });
    }

    moveCard(player, args) {
        if (args[1] === 'play') {
            this.game.promptForSelect(player, {
                location: ['archives', 'hand', 'purged'],
                cardType: ['Ally', 'Conjuration'],
                controller: 'self',
                activePromptTitle: 'Select a card to move into play',
                onSelect: (player, card) => {
                    this.game.addAlert('danger', '{0} manually moves {1} from {2} to play', player, card, card.location);
                    GameActions.moveCard({
                        destination: 'play area'
                    }).resolve(card, this.game.getFrameworkContext(player));
                    return true;
                }
            });
        }
        if (args[1] === 'spellboard') {
            this.game.promptForSelect(player, {
                location: ['archives', 'discard', 'hand', 'purged'],
                cardType: ['Ready Spell'],
                controller: 'self',
                activePromptTitle: 'Select a card to move onto spellboard',
                onSelect: (player, card) => {
                    this.game.addAlert('danger', '{0} manually moves {1} from {2} to spellboard', player, card, card.location);
                    GameActions.moveCard({
                        destination: 'spellboard'
                    }).resolve(card, this.game.getFrameworkContext(player));
                    return true;
                }
            });
        }
        if (args[1] === 'discard') {
            this.game.promptForSelect(player, {
                location: ['hand', 'play area', 'spellboard'],
                cardType: ['Action Spell', 'Ally', 'Alteration Spell', 'Reaction Spell', 'Ready Spell'], 
                controller: 'self',
                activePromptTitle: 'Select a card to move to discard',
                onSelect: (player, card) => {
                    this.game.addAlert('danger', '{0} manually moves {1} from {2} to discard', player, card, card.location);
                    GameActions.moveCard({
                        destination: 'discard'
                    }).resolve(card, this.game.getFrameworkContext(player));
                    return true;
                }
            });
        }
        if (args[1] === 'deck') {
            this.game.promptForSelect(player, {
                location: ['discard', 'hand', 'play area', 'spellboard'],
                cardType: ['Action Spell', 'Ally', 'Alteration Spell', 'Reaction Spell', 'Ready Spell'],
                controller: 'self',
                activePromptTitle: 'Select a card to move to your deck',
                onSelect: (player, card) => {
                    this.game.addAlert('danger', '{0} manually moves {1} from {2} to their deck', player, card, card.location);
                    GameActions.moveCard({
                        destination: 'deck'
                    }).resolve(card, this.game.getFrameworkContext(player));
                    return true;
                }
            });
        }
        if (args[1] === 'hand') {
            this.game.promptForSelect(player, {
                location: ['discard', 'play area', 'spellboard'],
                cardType: ['Ally', 'Ready Spell', 'Alteration'],
                controller: 'self',
                activePromptTitle: 'Select a card to move to your hand',
                onSelect: (player, card) => {
                    this.game.addAlert('danger', '{0} manually moves {1} from {2} to their hand', player, card, card.location);
                    GameActions.moveCard({
                        destination: 'hand'
                    }).resolve(card, this.game.getFrameworkContext(player));
                    return true;
                }
            });
        }
        if (args[1] === 'conjuration') {
            this.game.promptForSelect(player, {
                location: ['play area'],
                cardType: ['Conjuration', 'Conjured Alteration Spell'],
                controller: 'self',
                activePromptTitle: 'Select a card to move to conjuration pile',
                onSelect: (player, card) => {
                    this.game.addAlert('danger', '{0} moves {1} from {2} to their conjuration pile', player, card, card.location);
                    GameActions.moveCard({
                        destination: 'archives'
                    }).resolve(card, this.game.getFrameworkContext(player));
                    return true;
                }
            });
        }
    }

    removeEffects(player) {
        this.game.promptForSelect(player, {
            location: ['play area'],
            cardType: ['Ally', 'Conjuration'],
            controller: 'self',
            activePromptTitle: 'Select a card to remove effects from',
            onSelect: (player, card) => {
                this.game.addAlert('danger', '{0} removes temporary effects from {1}', player, card);
                card.removeLastingEffects();
                return true;
            }
        });
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

    passActiveTurn(player) {
        if (player === this.game.activePlayer) {
            this.spendAction(player, ['', 'main']);
            this.game.addAlert(
                'danger',
                '{0} passes the active turn to {1}',
                player,
                player.opponent
            );
            this.game.raiseEndTurnEvent(); //not endTurn directly as this would miss end of turn triggers
        }
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
            activePromptTitle: 'Select a card set token count',
            waitingPromptTitle: 'Waiting for opponent to set token',
            cardCondition: (card) =>
                (card.location === 'play area' || card.location === 'spellboard') &&
                card.controller === player,
            onSelect: (p, card) => {
                let numTokens = card.tokens[token] || 0;
                card.addToken(token, num - numTokens);
                this.game.addAlert(
                    'danger',
                    '{0} manually sets the {1} token count of {2} to {3}',
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
            activePromptTitle: 'Select a card to reveal',
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
            activePromptTitle: 'Select a conjuration to move to play',
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
