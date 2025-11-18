const _ = require('underscore');
const EventEmitter = require('events');
const moment = require('moment');

const ChatCommands = require('./chatcommands');
const GameChat = require('./gamechat');
const EffectEngine = require('./effectengine');
const Player = require('./player');
const Spectator = require('./spectator');
const GamePipeline = require('./gamepipeline');
const SetupPhase = require('./gamesteps/setup/setupphase');
const RecoveryPhase = require('./gamesteps/main/RecoveryPhase');
const SimpleStep = require('./gamesteps/simplestep');
const MenuPrompt = require('./gamesteps/menuprompt');
const HandlerMenuPrompt = require('./gamesteps/handlermenuprompt');
const SelectCardPrompt = require('./gamesteps/selectcardprompt');
const OptionsMenuPrompt = require('./gamesteps/OptionsMenuPrompt');
const GameWonPrompt = require('./gamesteps/GameWonPrompt');
const GameActions = require('./GameActions');
const Event = require('./Events/Event');
const EventWindow = require('./Events/EventWindow');
const AbilityResolver = require('./gamesteps/abilityresolver');
const SimultaneousEffectWindow = require('./gamesteps/SimultaneousEffectWindow');
const AbilityContext = require('./AbilityContext');
const MenuCommands = require('./MenuCommands');
const TimeLimit = require('./TimeLimit');
const PlainTextGameChatFormatter = require('./PlainTextGameChatFormatter');
const CardVisibility = require('./CardVisibility');
const PreparePhase = require('./gamesteps/main/PreparePhase');
const PlayerTurnsPhase = require('./gamesteps/main/PlayerTurnsPhase');
const Dice = require('./dice');
const SelectDiePrompt = require('./gamesteps/selectdieprompt');
const MeditatePrompt = require('./gamesteps/MeditatePrompt');
const { BattlefieldTypes, PhoenixbornTypes, ActionSpellTypes } = require('../constants');
const AttackFlow = require('./gamesteps/AttackFlow');
const ChosenDrawPrompt = require('./gamesteps/chosendrawprompt.js');
const FirstPlayerSelection = require('./gamesteps/setup/FirstPlayerSelection');
const SuddenDeathDiscardPrompt = require('./gamesteps/SuddenDeathDiscardPrompt');
const ManualModePrompt = require('./gamesteps/ManualModePrompt');
const logger = require('../log');
const DummyPlayer = require('./solo/DummyPlayer');
const PlayableObject = require('./PlayableObject');
const EndGamePrompt = require('./gamesteps/EndGamePrompt');

class Game extends EventEmitter {
    constructor(details, options = {}) {
        super();
        this.chatCommands = new ChatCommands(this);
        this.effectEngine = new EffectEngine(this);
        this.gameChat = new GameChat(this);
        this.pipeline = new GamePipeline();
        this.cardVisibility = new CardVisibility(details.showHand, details.openHands, details.solo);
        this.router = options.router;
        this.saveReplay = details.saveReplay;
        this.solo = details.solo;
        if (this.solo) {
            this.soloLevel = details.soloLevel;
            this.soloStage = details.soloStage;
        }
        // disable fatigue for tests
        this.disableFatigue = options.disableFatigue;

        this.showHand = details.showHand;
        this.openHands = details.openHands;
        this.allowSpectators = details.allowSpectators;

        this.currentAbilityWindow = null;
        this.currentActionWindow = null;
        this.currentEventWindow = null;
        this.currentPhase = '';

        this.createdAt = new Date();
        this.league = details.league;
        this.pairing = details.pairing;
        this.gamePrivate = details.gamePrivate;
        this.gameFormat = details.gameFormat;
        this.gameType = details.gameType;
        this.id = details.id;
        this.label = details.label;
        this.manualMode = false;
        this.muteSpectators = details.muteSpectators;
        this.name = details.name;
        this.owner = details.owner.username;
        this.password = details.password;
        this.playStarted = false;
        this.playersAndSpectators = {};
        this.savedGameId = details.savedGameId;
        this.started = false;
        this.swap = details.swap;
        this.triggerSuddenDeath = false;
        this.suddenDeath = false; // are we in sudden death mode? (mostly tracked in player)
        this.cardIndex = 0;
        this.cardLogIndex = 0;
        this.cardsUsed = [];
        // this should be private - use cardPlayed / diePlayed etc to record events
        this.gameLog = [];
        this.cardsDiscarded = [];
        this.effectsUsed = [];
        this.turnEvents = {};

        this.activePlayer = null;
        this.gameFirstPlayer = null;
        this.roundFirstPlayer = null;
        this.jsonForUsers = {};
        this.attackState = null;
        this.cardData = options.cardData || [];

        this.useGameTimeLimit = details.useGameTimeLimit;
        const clockDetails = { type: 'none', time: 0 };
        if (details.useGameTimeLimit) {
            if (details.clockType === 'timer') {
                this.gameTimeLimit = details.gameTimeLimit;
                this.timeLimit = new TimeLimit(this, this.gameTimeLimit);
            }
            clockDetails.type = details.clockType;
            clockDetails.time = details.gameTimeLimit;
        }
        this.clockType = details.clockType;
        _.each(details.players, (player) => {
            const newPlayer = this.createPlayer(player, clockDetails);
            this.playersAndSpectators[player.user.username] = newPlayer;
        });

        _.each(details.spectators, (spectator) => {
            this.playersAndSpectators[spectator.user.username] = new Spectator(
                spectator.id,
                spectator.user
            );
        });

        this.setMaxListeners(0);
    }

    createPlayer(player, clockDetails) {
        const isOwner = this.owner === player.user.username;
        if (player.playerType === 'dummy') {
            return new DummyPlayer(player.id, player.user, isOwner, this, clockDetails);
        }

        return new Player(player.id, player.user, isOwner, this, clockDetails);
    }

    getCardIndex() {
        this.cardIndex++;
        return this.cardIndex;
    }

    getCardLogIndex() {
        this.cardLogIndex++;
        return this.cardLogIndex;
    }

    cardUsed(card, player) {
        this.gameLog.push({
            id: 'cl' + this.getCardLogIndex(),
            act: 'use',
            obj: card,
            player: player
        });
    }
    //** remove card from card log - used for refund of play cost */
    undoCardUsed() {
        this.gameLog.pop();
    }

    diePowerUsed(die, player) {
        this.gameLog.push({
            id: 'cl' + this.getCardLogIndex(),
            act: 'use',
            obj: die,
            player: player
        });

        player.totalDiceSpend += 1;
    }

    cardPlayed(card, player) {
        const c = this.lastCardPlayed();
        if (!c || c.obj !== card) {
            this.gameLog.push({
                id: 'cl' + this.getCardLogIndex(),
                act: 'play',
                obj: card,
                player: player
            });
        }

        player.totalCardsPlayed += 1;

        if (!ActionSpellTypes.includes(card.type)) {
            card.new = true;
        }
    }

    cardPut(card, player) {
        const c = this.lastCardPlayed();
        if (!c || c.obj !== card) {
            this.gameLog.push({
                id: 'cl' + this.getCardLogIndex(),
                act: 'play',
                obj: card,
                player: player
            });
        }

        if (!ActionSpellTypes.includes(card.type)) {
            card.new = true;
        }
    }

    lastCardPlayed() {
        if (this.gameLog.length > 0) return this.gameLog[this.gameLog.length - 1];

        return null;
    }

    /**
     * Record that a unit has been destroyed this turn (e.g. for summon bone crow)
     */
    onUnitDestroyed() {
        this.turnEvents.unitDestroyed = true;
    }

    /*
     * Reports errors from the game engine back to the router
     * @param {type} e
     * @returns {undefined}
     */
    reportError(e) {
        this.router.handleError(this, e);
    }

    /**
     * Adds a message to the in-game chat e.g 'Jadiel draws 1 card'
     * @param {String} message to display (can include {i} references to args)
     * @param {Array} args to match the references in @string
     */
    addMessage() {
        this.gameChat.addMessage(...arguments);
    }

    /**
     * Adds a message to in-game chat with a graphical icon
     * @param {String} one of: 'endofround', 'success', 'info', 'danger', 'warning'
     * @param {String} message to display (can include {i} references to args)
     * @param {Array} args to match the references in @string
     */
    addAlert() {
        this.gameChat.addAlert(...arguments);
    }

    get messages() {
        return this.gameChat.messages;
    }

    getPlainTextLog() {
        let formatter = new PlainTextGameChatFormatter(this.gameChat);
        return formatter.format();
    }

    /**
     * Checks if a player is a spectator
     * @param {Object} player
     * @returns {Boolean}
     */
    isSpectator(player) {
        return player.constructor === Spectator;
    }

    /**
     * Checks whether a player/spectator is still in the game
     * @param {String} playerName
     * @returns {Boolean}
     */
    hasActivePlayer(playerName) {
        return this.playersAndSpectators[playerName] && !this.playersAndSpectators[playerName].left;
    }

    /**
     * Get all players (not spectators) in the game
     * @returns {Player[]}
     */
    getPlayers() {
        return Object.values(this.playersAndSpectators).filter(
            (player) => !this.isSpectator(player)
        );
    }

    /**
     * Returns the Player object (not spectator) for a name
     * @param {String} playerName
     * @returns {Player}
     */
    getPlayerByName(playerName) {
        let player = this.playersAndSpectators[playerName];
        if (player && !this.isSpectator(player)) {
            return player;
        }
    }

    /**
     * Returns the player object for the dummy player when in solo mode
     * @returns {Player}
     */
    getDummyPlayer() {
        return this.getPlayers().find((p) => p.isDummy);
    }

    getSoloPlayer() {
        return this.getPlayers().find((p) => !p.isDummy);
    }

    /**
     * Get all players and spectators in the game
     * @returns {Object} {name1: Player, name2: Player, name3: Spectator}
     */
    getPlayersAndSpectators() {
        return this.playersAndSpectators;
    }

    /**
     * Get all spectators in the game
     * @returns {Spectator[]} {name1: Spectator, name2: Spectator}
     */
    getSpectators() {
        return Object.values(this.playersAndSpectators).filter((player) =>
            this.isSpectator(player)
        );
    }

    /**
     * Gets a player other than the one passed (usually their opponent)
     * @param {Player} player
     * @returns {Player}
     */
    getOtherPlayer(player) {
        let otherPlayer = this.getPlayers().find((p) => {
            return p.name !== player.name;
        });

        return otherPlayer;
    }

    /**
     * Returns the card (i.e. character) with matching uuid from either players
     * 'in play' area.
     * @param {String} cardId
     * @returns Card
     */
    findAnyCardInPlayByUuid(cardId) {
        return _.reduce(
            this.getPlayers(),
            (card, player) => {
                if (card) {
                    return card;
                }

                return player.cardsInPlay.find((card) => card.uuid === cardId);
            },
            null
        );
    }

    /**
     * Returns the card with matching uuid from anywhere in the game
     * @param {String} cardId
     * @returns Card
     */
    findAnyCardInAnyList(cardId) {
        return this.allCards.find((card) => card.uuid === cardId);
    }

    /**
     * Returns the die with matching uuid from anywhere in the game
     * @param {String} dieId
     * @returns Die
     */
    findAnyDieInAnyList(dieId) {
        const allDice = this.getAllDice();
        const foundDie = allDice.find((die) => die.uuid === dieId);
        return foundDie;
    }

    getAllDice() {
        const dieUpgrades = _.reduce(
            this.cardsInPlay,
            (dice, card) => {
                return dice.concat(card.dieUpgrades);
            },
            []
        );
        return _.reduce(
            this.getPlayers(),
            (dice, player) => {
                return dice.concat(player.dice);
            },
            dieUpgrades
        );
    }

    /**
     * Returns all cards (i.e. characters) which matching the passed predicated
     * function from either players 'in play' area.
     * @param {Function} predicate - card => Boolean
     * @returns {Array} Array of DrawCard objects
     */
    findAnyCardsInPlay(predicate) {
        let foundCards = [];

        _.each(this.getPlayers(), (player) => {
            foundCards = foundCards.concat(player.cardsInPlay.filter(predicate));
        });

        return foundCards;
    }

    get actions() {
        return GameActions;
    }

    stopClocks() {
        _.each(this.getPlayers(), (player) => player.stopClock());
    }

    resetClocks() {
        _.each(this.getPlayers(), (player) => player.resetClock());
    }

    startTimer() {
        this.timeLimit && this.timeLimit.startTimer();
    }

    stopTimer() {
        this.timeLimit && this.timeLimit.stopTimer();
    }

    /**
     * This function is called from the client whenever a card is clicked
     * @param {String} username - name of the clicking user
     * @param {String} cardId - uuid of the card clicked
     */
    cardClicked(username, cardId) {
        let player = this.getPlayerByName(username);

        if (!player) {
            return;
        }

        let card = this.findAnyCardInAnyList(cardId);

        if (!card) {
            return;
        }

        // Check to see if the current step in the pipeline is waiting for input
        this.pipeline.handleCardClicked(player, card);
    }

    pileClicked(sourcePlayer, source) {
        let player = this.getPlayerByName(sourcePlayer);

        if (!player) {
            return;
        }

        if (!source) {
            return;
        }

        // Check to see if the current step in the pipeline is waiting for input
        this.pipeline.handleCardPileClicked(player, source);
    }

    /**
     * This function is called from the client whenever a card is clicked
     * @param {String} sourcePlayer - name of the clicking player
     * @param {String} cardId - uuid of the card clicked
     */
    cardAltClicked(sourcePlayer, cardId) {
        let player = this.getPlayerByName(sourcePlayer);

        if (!player) {
            return;
        }

        let card = this.findAnyCardInAnyList(cardId);

        if (!card || !card.altArts || !card.altArts.length) {
            return;
        }

        // Cycle the alt art for the card and this player
        const count = card.altArts.length;
        const index = card.altArts.indexOf(card.imageStub);
        let newIndex = 0;
        if (index !== count - 1) {
            newIndex = index + 1;
        }
        card.imageStub = card.altArts[newIndex];
    }

    /**
     * This function is called from the client whenever a die is clicked
     * @param {String} sourcePlayer - name of the clicking player
     * @param {String} dieId - uuid of the die clicked
     */
    dieClicked(sourcePlayer, dieId) {
        let player = this.getPlayerByName(sourcePlayer);

        if (!player) {
            return;
        }

        let die = this.findAnyDieInAnyList(dieId);

        if (!die) {
            return;
        }

        // Check to see if the current step in the pipeline is waiting for input
        this.pipeline.handleDieClicked(player, die);
    }

    facedownCardClicked(playerName, location, controllerName, isProvince = false) {
        let player = this.getPlayerByName(playerName);
        let controller = this.getPlayerByName(controllerName);
        if (!player || !controller) {
            return;
        }

        let list = controller.getSourceList(location);
        if (!list) {
            return;
        }

        let card = list.find((card) => !isProvince === !card.isProvince);
        if (card) {
            return this.pipeline.handleCardClicked(player, card);
        }
    }

    /**
     * This function is called by the client when a card menu item is clicked
     * @param {String} sourcePlayer - name of clicking player
     * @param {String} sourceId - uuid of object whose menu was clicked
     * @param {Object} menuItem - { command: String, text: String, arg: String, method: String }
     */
    menuItemClick(sourcePlayer, sourceId, menuItem) {
        let player = this.getPlayerByName(sourcePlayer);
        if (!player) {
            return;
        }

        let card = this.findAnyCardInAnyList(sourceId);
        let die = this.findAnyDieInAnyList(sourceId);

        if (!die && !card) return;

        if (card) {
            if (menuItem.command === 'click') {
                this.cardClicked(sourcePlayer, sourceId);
                return;
            }
            if (menuItem.command === 'inspect') {
                this.inspectCard(sourcePlayer, sourceId);
            }
            MenuCommands.cardMenuClick(menuItem, this, player, card);
        } else if (die) {
            if (menuItem.command === 'click') {
                this.dieClicked(sourcePlayer, sourceId);
                return;
            }
            MenuCommands.dieMenuClick(menuItem, this, player, die);
        }

        this.checkGameState(true);
    }

    /**
     * Sets a Player flag and displays a chat message to show that a popup with a
     * player's deck is open
     * @param {String} playerName
     */
    showDeck(playerName) {
        let player = this.getPlayerByName(playerName);

        if (!player) {
            return;
        }

        if (!player.showDeck) {
            player.showDeck = true;

            this.addMessage('{0} is looking at their deck', player);
        } else {
            player.showDeck = false;

            this.addMessage('{0} stops looking at their deck', player);
        }
    }

    /**
     * This function is called from the client whenever a card is dragged from
     * one place to another
     * @param {String} playerName
     * @param {String} cardId - uuid of card
     * @param {String} source - area where the card was dragged from
     * @param {String} target - area where the card was dropped
     */
    drop(playerName, cardId, source, target) {
        let player = this.getPlayerByName(playerName);

        if (!player) {
            return;
        }

        player.drop(cardId, source, target);
    }

    /**
     * Check to see if either player has won/lost the game due to damage
     */
    checkWinCondition() {
        for (const player of this.getPlayers()) {
            if (player.phoenixborn.damage >= player.phoenixborn.life) {
                this.recordWinner(player.opponent, 'damage');
            }
        }
    }

    /**
     * Display message declaring victory for one player, and record stats for
     * the game
     * @param {Player} winner
     * @param {String} reason
     */
    recordWinner(winner, reason) {
        if (this.winner) {
            return;
        }

        this.addAlert('success', '{0} has won the game', winner);
        this.setWins(winner.name, winner.wins ? winner.wins + 1 : 1);
        this.winner = winner;

        this.recordGameEnd(reason);

        this.router.gameWon(this, reason, winner);
        this.queueStep(new GameWonPrompt(this, winner));
    }

    recordGameEnd(reason) {
        this.finishedAt = new Date();
        this.stopClocks();
        if (this.useGameTimeLimit && this.timeLimit) {
            this.timeLimit.stopTimer();
        }
        this.addMessage('Game finished at: {0}', moment(this.finishedAt).format('DD-MM-yy hh:mm'));
        this.winReason = reason;
        this.saveReplayState('end');
    }

    saveReplayState(tag) {
        if (this.saveReplay) {
            this.router.saveReplayState(this, tag);
        }
    }

    /**
     * Changes a Player variable and displays a message in chat
     * @param {String} playerName
     * @param {String} stat
     * @param {Number} value
     */
    changeStat(playerName, stat, value, info) {
        let player = this.getPlayerByName(playerName);
        if (!player) {
            return;
        }

        let target = player;

        target.actions[stat] += value;

        if (target.actions[stat] < 0) {
            target.actions[stat] = 0;
        } else {
            this.addAlert(
                info ? 'info' : 'danger',
                '{0} sets {1} to {2} ({3})',
                player,
                stat,
                target.actions[stat],
                (value > 0 ? '+' : '') + value
            );
        }
    }

    inspectCard(playerName, cardId) {
        const player = this.getPlayerByName(playerName);
        const card = this.findAnyCardInAnyList(cardId);
        if (!player || !card) {
            return;
        }
        // must close the inspector before showing another card
        if (player.inspectionCard) {
            return;
        }
        player.inspectCard(card);
    }

    closeInspector(playerName) {
        const player = this.getPlayerByName(playerName);
        if (!player) {
            return;
        }
        player.clearInspector();
        this.checkGameState(true);
    }

    modifyCardToken(playerName, uuid, tokenType, increment) {
        const player = this.getPlayerByName(playerName);

        if (!player) {
            return;
        }

        const card = this.findAnyCardInAnyList(uuid);
        card.addToken(tokenType, increment);
        let addRemove = 'adds';
        let toFrom = 'to';
        if (increment < 0) {
            addRemove = 'removes';
            toFrom = 'from';
        }
        this.addAlert('danger', `{0} ${addRemove} 1 {1} ${toFrom} {2}`, player, tokenType, card);
    }

    writeDefenceMessages(player) {
        const blockType = this.attackState.isPBAttack ? 'block' : 'guard';

        this.addMessage('{0} has chosen defenders', player);
        this.attackState.battles
            .sort((a) => (a.guard ? -1 : 1))
            .forEach((battle) => {
                if (battle.guard) {
                    this.addMessage(
                        '{0} will {1} against {2}',
                        battle.guard,
                        blockType,
                        battle.attacker
                    );
                } else {
                    this.addMessage('{0} will be un' + blockType + 'ed ', battle.attacker);
                }
            });
    }

    modifyAction(playerName, actionType, unspent) {
        let player = this.getPlayerByName(playerName);
        if (!player) {
            return;
        }

        if (unspent) {
            this.chatCommands.spendAction(player, ['modify-action', actionType]);
        } else {
            this.chatCommands.unSpendAction(player, ['modify-action', actionType]);
        }
    }

    // handle game message
    modifyLimited(playerName, currentValue) {
        let player = this.getPlayerByName(playerName);
        if (!player) {
            return;
        }

        this.chatCommands.changeLimited(player, !currentValue);
    }

    /**
     * This function is called by the client every time a player enters a chat message
     * @param {String} playerName
     * @param {String} message
     */
    chat(playerName, message) {
        let player = this.playersAndSpectators[playerName];
        let args = message.split(' ');

        if (!player) {
            return;
        }

        if (!this.isSpectator(player) && this.manualMode) {
            if (this.chatCommands.executeCommand(player, args[0], args)) {
                this.checkGameState(true);
                return;
            }
        }

        if (!this.isSpectator(player) || !this.muteSpectators) {
            this.gameChat.addChatMessage('{0} {1}', player, message);
        }
    }

    /**
     * This is called by the client when a player clicks 'Concede'
     * @param {String} playerName
     */
    concede(playerName) {
        let player = this.getPlayerByName(playerName);

        if (!player) {
            return;
        }

        this.addAlert('info', '{0} concedes', player);

        let otherPlayer = this.getOtherPlayer(player);

        if (otherPlayer) {
            this.recordWinner(otherPlayer, 'concede');
        }
    }

    endWithoutLoss() {
        this.recordGameEnd('Agreement');
        this.queueStep(new GameWonPrompt(this));
    }

    selectDeck(playerName, deck) {
        let player = this.getPlayerByName(playerName);
        if (player) {
            player.selectDeck(deck);
        }
    }

    setWins(playerName, wins) {
        let player = this.getPlayerByName(playerName);
        if (player) {
            player.setWins(wins);
        }
    }

    /**
     * Called when a player clicks Shuffle Deck on the conflict deck menu in
     * the client
     * @param {String} playerName
     */
    shuffleDeck(playerName) {
        let player = this.getPlayerByName(playerName);
        if (player) {
            player.shuffleDeck();
        }
    }

    /**
     * Prompts a player with a multiple choice menu
     * @param {Player} player
     * @param {Object} contextObj - the object which contains the methods that are referenced by the menubuttons
     * @param {Object} properties - see menuprompt
     */
    promptWithMenu(player, contextObj, properties) {
        this.queueStep(new MenuPrompt(this, player, contextObj, properties));
    }

    /**
     * Prompts a player with a multiple choice menu
     * @param {Player} player
     * @param {Object} properties - see handlermenuprompt
     */
    promptWithHandlerMenu(player, properties) {
        this.queueStep(new HandlerMenuPrompt(this, player || this.activePlayer, properties));
    }

    /**
     * Prompts a player with a dropdown options menu
     * @param {Player} player
     * @param {Object} properties - see handlermenuprompt
     */
    promptWithOptionsMenu(player, properties) {
        this.queueStep(new OptionsMenuPrompt(this, player || this.activePlayer, properties));
    }

    /**
     * Prompts a player to click a card
     * @param {Player} player
     * @param {Object} properties - see selectcardprompt
     */
    promptForSelect(player, properties) {
        let choosingPlayer = player;
        if (choosingPlayer.isDummy) {
            choosingPlayer = choosingPlayer.opponent;
            properties.promptTitle = 'CHIMERA CHOICE';
            properties.style = 'danger';
        }
        this.queueStep(new SelectCardPrompt(this, choosingPlayer, properties));
    }

    promptForDieSelect(player, properties) {
        this.queueStep(new SelectDiePrompt(this, player, properties));
    }

    promptForMeditation() {
        this.queueStep(new MeditatePrompt(this));
    }

    promptForSuddenDeathDiscard() {
        this.queueStep(new SuddenDeathDiscardPrompt(this));
    }

    promptForDiceChange(player, properties) {
        this.promptForDieSelect(player, properties);
    }

    //TODO: refactor to allow reuse for other gameActions, not just draw
    promptForAdditionalDraw(properties) {
        this.queueStep(new ChosenDrawPrompt(this, properties));
    }

    queueUserAlert(context, options = {}) {
        const player = options.self ? context.player : context.player.opponent;
        const timerLength = player.getAlertTimerSetting();
        // don't show timed alerts to players who set timerLength to 0
        if ((this.solo && player instanceof DummyPlayer) || (options.timed && timerLength === 0)) {
            return;
        }

        const buttons = [];
        if (options.timed) {
            buttons.push({ timer: true, method: 'pass' });
            buttons.push({ text: 'Wait', timerCancel: true });
        }
        buttons.push({ text: 'Ok', method: 'pass' });

        const activePrompt = {
            showAlert: true,
            promptTitle: options.promptTitle,
            menuTitle: options.menuTitle,
            controls: options.controls,
            buttons: buttons,
            style: options.style
        };

        if (options.timed) {
            activePrompt.timerLength = timerLength;
        }

        this.promptWithMenu(
            player,
            { pass: () => true }, // context object to handle 'do nothing' pass
            {
                source: options.source || 'Triggered Abilities',
                waitingPromptTitle: 'Alerting opponent',
                activePrompt: activePrompt
            }
        );
    }

    // from triggered ability window
    getPromptControls(triggeringEvents) {
        let map = new Map();
        for (let event of triggeringEvents) {
            let src = event.damageSource || (event.context && event.context.source);

            if (event.context && src) {
                let targets = map.get(event.context.source) || [];
                if (event.context.target && event.context.target instanceof PlayableObject) {
                    targets = targets.concat(event.context.target);
                } else if (event.card && event.card !== event.context.source) {
                    targets = targets.concat(event.card);
                } else if (event.context.event && event.context.event.card) {
                    targets = targets.concat(event.context.event.card);
                } else if (event.card) {
                    targets = targets.concat(event.card);
                }

                map.set(src, _.uniq(targets));
            }
        }

        return [...map.entries()].map(([source, targets]) => ({
            type: 'targeting',
            source: source.getShortSummary(),
            targets: targets.map((target) => target.getShortSummary())
        }));
    }

    /**
     * This function is called by the client whenever a user clicks a button
     * in a prompt
     * @param {String} username
     * @param {String} arg - arg property of the button clicked
     * @param {String} uuid - unique identifier of the prompt clicked
     * @param {String} method - method property of the button clicked
     * @returns {Boolean} this indicates to the server whether the received input is legal or not
     */
    menuButton(username, arg, uuid, method) {
        let player = this.getPlayerByName(username);
        if (!player) {
            return false;
        }

        // check to see if the current step in the pipeline is waiting for input
        return this.pipeline.handleMenuCommand(player, arg, uuid, method);
    }

    /**
     * This function is called by the client when a player chess clock hits Zero.
     * It doesn't do anything, but needs to exist for the message handler to stop the clocks
     * This needs to exist for gameserver to trigger the state check (and immediate win/loss)
     * @param {String} playerName
     */
    clockZero(playerName) {
        logger.info(playerName, ' clockZero message recived');
    }
    /*
     * This function is called by the client when a player clicks an option setting
     * toggle in the settings menu
     * @param {String} playerName
     * @param {String} settingName - the name of the setting being toggled
     * @param {Boolean} toggle - the new setting of the toggle
     * @returns {undefined}
     */
    toggleOptionSetting(playerName, settingName, toggle) {
        let player = this.getPlayerByName(playerName);
        if (!player) {
            return;
        }

        player.optionSettings[settingName] = toggle;
    }

    toggleManualMode(playerName) {
        let player = this.getPlayerByName(playerName);
        if (!player) {
            return;
        }

        if (this.manualMode) {
            this.manualMode = false;
            this.addAlert('danger', '{0} switches manual mode off', player);
            this.getPlayers().forEach((p) => {
                p.clearInspector();
            });
        } else {
            if (this.solo || player.opponent.isAwol) {
                this.manualMode = true;
                this.addAlert('danger', '{0} switches manual mode on', player);
                return;
            }
            if (!this.requestingManualMode && !player.opponent.disconnectedAt) {
                this.addAlert('danger', '{0} is attempting to switch manual mode on', player);
                this.requestingManualMode = true;
                this.queueStep(new ManualModePrompt(this, player));
            }
        }
    }

    manualEndGame(player) {
        if (player.opponent.isAwol || this.solo) {
            // end without asking
            this.addAlert('danger', '{0} ends the game', player);
            this.endWithoutLoss();
        } else {
            this.addAlert('danger', '{0} wants to end the game without loss', player);
            this.queueStep(new EndGamePrompt(this, player));
        }
    }

    toggleMuteSpectators(playerName) {
        let player = this.getPlayerByName(playerName);
        if (!player) {
            return;
        }

        this.chatCommands.muteSpectators(player);
    }

    /*
     * Sets up Player objects, creates allCards, checks each player has a stronghold
     * and starts the game pipeline
     * @returns {undefined}
     */
    initialise() {
        let players = {};

        _.each(this.playersAndSpectators, (player) => {
            if (!player.left) {
                players[player.name] = player;
            }
        });

        this.playersAndSpectators = players;

        this.on('onGameStarted', () => {
            if (this.useGameTimeLimit && this.timeLimit) {
                this.timeLimit && this.timeLimit.startTimer();
            }
        });

        for (let player of this.getPlayers()) {
            player.initialise();
        }

        this.allCards = _.reduce(
            this.getPlayers(),
            (cards, player) => {
                let result = cards.concat(player.deck, player.archives, player.phoenixborn);
                if (this.solo && player instanceof DummyPlayer) {
                    result = result.concat(player.ultimate);
                }
                return result;
            },
            []
        );

        this.pipeline.initialise([
            new SetupPhase(this),
            new SimpleStep(this, () => this.beginRound())
        ]);

        this.playStarted = true;
        this.startedAt = new Date();
        this.round = 0;

        this.continue();
    }

    determineFirstPlayer() {
        if (!this.gameFirstPlayer) {
            const players = this.getPlayers();

            const firstPlayerParams = {};
            if (this.solo) {
                this.setGameFirstPlayer(this.getSoloPlayer());
            } else {
                let i = 0;
                while (
                    Dice.countBasic(players[0].dice) == Dice.countBasic(players[1].dice) &&
                    i < 100
                ) {
                    this.reRollPlayerDice();
                    i++;
                }
                const basicCounts = [
                    Dice.countBasic(players[0].dice),
                    Dice.countBasic(players[1].dice)
                ];
                this.addMessage('{0} rolls {1} basic dice', players[0].name, basicCounts[0]);
                this.addMessage('{0} rolls {1} basic dice', players[1].name, basicCounts[1]);

                const activeIndex = basicCounts[0] > basicCounts[1] ? 0 : 1;
                this.activePlayer = players[activeIndex];

                this.addAlert(
                    'info',
                    '{0} rolled the most basics so will choose first player',
                    this.activePlayer
                );
                firstPlayerParams.activeBasics = basicCounts[activeIndex];
                firstPlayerParams.opponentBasics = basicCounts[1 - activeIndex];
                this.queueStep(new FirstPlayerSelection(this, firstPlayerParams));
            }
        } else {
            const newFirstPlayer =
                this.round === 1 ? this.gameFirstPlayer : this.roundFirstPlayer.opponent;
            // this.round % 2 > 0 ? this.gameFirstPlayer : this.gameFirstPlayer.opponent;
            this.setRoundFirstPlayer(newFirstPlayer);
            this.addMessage('{0} goes first this round', this.activePlayer);
        }
    }

    // this only gets called once at the start of the game
    setGameFirstPlayer(player) {
        this.gameFirstPlayer = player;
        this.setRoundFirstPlayer(player);
    }

    setRoundFirstPlayer(player, makeActive = true) {
        this.roundFirstPlayer = player;
        player.firstPlayer = true;
        player.opponent.firstPlayer = false;
        if (makeActive) {
            this.activePlayer = player;
        }
    }

    reRollPlayerDice() {
        for (let player of this.getPlayers().filter((p) => !p.isDummy)) {
            player.rerollAllDice(this.round);
        }
    }

    unpinPlayerDice() {
        for (let player of this.getPlayers().filter((p) => !p.isDummy)) {
            player.unpinAllDice();
        }
    }

    // time limit / OP sudden death trigger
    checkForTimeExpired() {
        if (
            this.useGameTimeLimit &&
            !this.triggerSuddenDeath &&
            this.timeLimit &&
            this.timeLimit.isTimeLimitReached &&
            // game hasn't finished
            !this.finishedAt &&
            !this.suddenDeath
        ) {
            this.activateSuddenDeath();
        }
    }

    activateSuddenDeath() {
        this.triggerSuddenDeath = true;
        this.addAlert(
            'warning',
            'The allowed game time has ended. The game will enter SUDDEN DEATH mode at the beginning of the next first player turn'
        );
    }

    /*
     * Adds each of the game's main phases to the pipeline
     * @returns {undefined}
     */
    beginRound() {
        this.round++;
        this.betweenRounds = false;

        this.addAlert('startofround', `Round ${this.round}`);

        this.raiseEvent('onBeginRound');
        this.getPlayers().forEach((player) => player.beginRound());
        this.queueStep(new PreparePhase(this));

        this.queueStep(new PlayerTurnsPhase(this));

        this.queueStep(new RecoveryPhase(this));

        this.queueStep(new SimpleStep(this, () => this.raiseEndRoundEvent()));
        this.queueStep(new SimpleStep(this, () => this.beginRound()));
    }

    beginTurn() {
        this.betweenTurns = false;
        this.turnEvents = {};

        // Would be better to have this refresh during endTurn, but couldn't work out how to ensure reset after other endTurn effects
        this.cardsInPlay.forEach((c) => {
            c.wasAttacker = false;
            c.wasDefender = false;
        });

        this.getPlayers().forEach((p) => (p.limitedPlayed = 0)); // reset reaction count for next turn

        this.raiseEvent('onBeginTurn', { player: this.activePlayer }, () => {
            this.saveReplayState('begin-turn');
        });
        if (
            this.triggerSuddenDeath &&
            this.activePlayer === this.roundFirstPlayer &&
            !this.suddenDeath
        ) {
            this.triggerSuddenDeath = false;
            this.getPlayers().forEach((p) => (p.suddenDeath = true));
            this.suddenDeath = true;
        }
    }

    resetRemovedFlags() {
        this.allCards.forEach((c) => {
            c.removed = false;
        });
    }
    /*
     * Adds a step to the pipeline queue
     * @param {BaseStep} step
     * @returns {undefined}
     */
    queueStep(step) {
        this.pipeline.queueStep(step);
        return step;
    }

    /*
     * Creates a step which calls a handler function
     * @param {Function} handler - () => undefined
     * @returns {undefined}
     */
    queueSimpleStep(handler) {
        this.pipeline.queueStep(new SimpleStep(this, handler));
    }

    /*
     * Resolves a card ability
     * @param {AbilityContext} context - see AbilityContext
     * @returns {undefined}
     */
    resolveAbility(context) {
        this.raiseEvent('onResolveAbility', { context }, () => {
            this.queueStep(new AbilityResolver(this, context));
        });
    }

    openSimultaneousEffectWindow(choices) {
        let window = new SimultaneousEffectWindow(this);
        _.each(choices, (choice) => window.addChoice(choice));
        this.queueStep(window);
    }

    getEvent(eventName, params, handler) {
        return new Event(eventName, params, handler);
    }

    /**
     * Creates a game Event, and opens a window for it.
     * @param {String} eventName
     * @param {Object} params - parameters for this event
     * @param {Function} handler - (Event + params) => undefined
     * @returns {Event} - this allows the caller to track Event.resolved and
     * tell whether or not the handler resolved successfully
     */
    raiseEvent(eventName, params = {}, handler = () => true) {
        let event = this.getEvent(eventName, params, handler);
        this.openEventWindow([event]);
        return event;
    }

    emitEvent(eventName, params = {}) {
        let event = this.getEvent(eventName, params);
        this.emit(event.name, event);
    }

    /**
     * Creates an EventWindow which will open windows for each kind of triggered
     * ability which can respond to any passed events, and execute their handlers.
     * @param event
     * @returns {EventWindow}
     */
    openEventWindow(event) {
        if (_.isArray(event)) {
            if (event.length === 0) {
                return;
            } else if (event.length > 1) {
                for (let e of event.slice(1)) {
                    event[0].addChildEvent(e);
                }
            }

            return this.queueStep(new EventWindow(this, event[0]));
        }

        return this.queueStep(new EventWindow(this, event));
    }

    /**
     * Checks whether a game action can be performed on a card or an array of
     * cards, and performs it on all legal targets.
     * @param {AbilityContext} context
     * @param {Object} actions - Object with { actionName: targets }
     * @returns {Event[]} - TODO: Change this?
     */
    applyGameAction(context, actions) {
        if (!context) {
            context = this.getFrameworkContext();
        }

        let actionPairs = Object.entries(actions);
        let events = actionPairs.reduce((array, [action, cards]) => {
            let gameAction = GameActions[action]();
            gameAction.setTarget(cards);
            return array.concat(gameAction.getEventArray(context));
        }, []);
        if (events.length > 0) {
            this.openEventWindow(events);
        }

        return events;
    }

    getFrameworkContext(player = null) {
        return new AbilityContext({ game: this, player: player });
    }

    /**
     * Changes the controller of a card in play to the passed player, and cleans
     * all the related stuff up
     * @param {Player} player
     * @param card
     */
    takeControl(player, card) {
        if (card.controller === player || !card.allowGameAction('takeControl')) {
            return;
        }

        // this.raiseEvent('onTakeControl', { player, card });
        card.controller.removeCardFromPile(card);
        player.cardsInPlay.push(card);
        this.queueSimpleStep(() => this.checkGameState(true));
    }

    watch(socketId, user) {
        if (!this.allowSpectators && !user.permissions.canManageGames) {
            return false;
        }

        this.playersAndSpectators[user.username] = new Spectator(socketId, user);
        this.addAlert('info', '{0} has joined the game as a spectator', user.username);

        return true;
    }

    join(socketId, user) {
        if (this.started || this.getPlayers().length === 2) {
            return false;
        }

        this.playersAndSpectators[user.username] = new Player(
            socketId,
            user,
            this.owner === user.username,
            this
        );

        return true;
    }

    isEmpty() {
        return Object.values(this.playersAndSpectators)
            .filter((d) => !(d instanceof DummyPlayer))
            .every((player) => {
                if (player.left || player.id === 'TBA') {
                    return true;
                }

                if (!player.disconnectedAt) {
                    return false;
                }

                let difference = moment().diff(moment(player.disconnectedAt), 'minutes');

                return difference > 5;
            });
    }

    leave(playerName) {
        let player = this.playersAndSpectators[playerName];

        if (!player) {
            return;
        }
        if (!this.finishedAt) {
            this.concede(playerName);
        }
        this.addAlert('info', '{0} has left the game', player);

        this.jsonForUsers[player.name] = undefined;

        if (this.isSpectator(player) || !this.started) {
            delete this.playersAndSpectators[playerName];
        } else {
            player.left = true;

            if (!this.finishedAt) {
                this.finishedAt = new Date();
            }
        }
    }

    disconnect(playerName) {
        let player = this.playersAndSpectators[playerName];

        if (!player) {
            return;
        }

        this.jsonForUsers[player.name] = undefined;

        if (this.isSpectator(player)) {
            delete this.playersAndSpectators[playerName];
        } else {
            this.addAlert(
                'info',
                '{0} has disconnected. They can reconnect if you wait for them.',
                player
            );
            player.disconnectedAt = new Date();
        }

        player.socket = undefined;
    }

    rematch() {
        if (!this.finishedAt) {
            this.finishedAt = new Date();
            this.winReason = 'rematch';
        }

        this.router.rematch(this);
    }

    timeExpired() {
        this.emit('onTimeExpired');
    }

    failedConnect(playerName) {
        let player = this.playersAndSpectators[playerName];

        if (!player) {
            return;
        }

        if (this.isSpectator(player) || !this.started) {
            delete this.playersAndSpectators[playerName];
        } else {
            this.addAlert('warning', '{0} has failed to connect to the game', player);

            player.disconnectedAt = new Date();

            if (!this.finishedAt) {
                this.finishedAt = new Date();
            }
        }
    }

    reconnect(socket, playerName) {
        let player = this.getPlayerByName(playerName);
        if (!player) {
            return;
        }

        player.id = socket.id;
        player.socket = socket;
        player.disconnectedAt = undefined;

        this.jsonForUsers[player.name] = undefined;

        this.addAlert('info', '{0} has reconnected', player);
    }

    checkGameState(hasChanged = false) {
        // check for a game state change (recalculating conflict skill if necessary)
        if (this.effectEngine.checkEffects(hasChanged) || hasChanged) {
            this.checkWinCondition();
            // if the state has changed, check for:
            for (const player of this.getPlayers()) {
                _.each(player.cardsInPlay, (card) => {
                    if (card.getModifiedController() !== player) {
                        // any card being controlled by the wrong player
                        this.takeControl(card.getModifiedController(), card);
                    }
                });
            }

            // destroy any creatures who have damage greater than equal to their life
            let creaturesToDestroy = this.unitsInPlay.filter(
                (card) =>
                    BattlefieldTypes.includes(card.type) &&
                    (card.life <= 0 || card.tokens.damage >= card.life) &&
                    !card.moribund &&
                    !card.skipDestroyCheck
            );
            if (creaturesToDestroy.length > 0) {
                this.actions.destroy().resolve(creaturesToDestroy, this.getFrameworkContext());
            }

            // any terminal conditions which have met their condition
            this.effectEngine.checkTerminalConditions();
        }
    }

    checkDelayedEffects(events) {
        if (events.length > 0) {
            // check for any delayed effects which need to fire
            this.effectEngine.checkDelayedEffects(events);
        }
    }

    raiseEndRoundEvent() {
        this.betweenRounds = true;
        this.raiseEvent('onRoundEnded', { genuine: true }, () => {
            this.endRound();
        });
    }

    switchActivePlayer() {
        if (this.activePlayer.opponent) {
            this.activePlayer = this.activePlayer.opponent;
        }
    }

    raiseEndTurnEvent() {
        this.raiseEvent(
            'onTurnEnded',
            { player: this.activePlayer, round: this.round },
            (event) => {
                // game loss for player out of time
                if (event.player.loseOnTurnEnd) {
                    this.recordWinner(event.player.opponent, 'clock');
                } else {
                    this.endTurn();
                }
            }
        );
    }

    endTurn() {
        this.betweenTurns = true;
        this.activePlayer.endTurn();
        this.cardsDiscarded = [];
        this.effectsUsed = [];

        for (let card of this.cardsInPlay) {
            card.endTurn();
        }
        this.checkForTimeExpired();
    }

    endRound() {
        this.getPlayers().forEach((player) => player.endRound());
        this.gameLog = [];
        this.cardsDiscarded = [];
        this.effectsUsed = [];

        for (let card of this.cardsInPlay) {
            card.endRound();
        }

        this.addAlert('endofround', `End of round ${this.round}`);
        this.checkForTimeExpired();
    }

    playerKeys() {
        return `0 keys`;
    }

    get cardsInPlay() {
        return this.getPlayers().reduce(
            (array, player) => array.concat(player.cardsInPlay, player.spellboard),
            []
        );
    }

    get unitsInPlay() {
        return this.cardsInPlay.filter(
            (card) => BattlefieldTypes.includes(card.type) && !card.facedown
        );
    }

    continue() {
        this.pipeline.continue();
    }

    doAttackersDeclared(attackingPlayer, attackers) {
        const params = {
            attackingPlayer: attackingPlayer,
            attackers: attackers,
            target: this.attackState.target
        };
        this.raiseEvent('onAttackersDeclared', params, (event) => {
            // check for horde attack
            if (attackers.some((unit) => unit.anyEffect('hordeAttack'))) {
                const hordeAttackers = event.attackingPlayer.getHordeAttackers(event.attackers);
                if (hordeAttackers.length > 0) {
                    event.attackers.push(...hordeAttackers);
                }
            }

            this.addAlert(
                'danger',
                '{0} attacks {1} with {2} units: {3}',
                this.attackState.attackingPlayer,
                this.attackState.target,
                attackers.length,
                attackers
            );

            let key = 1;
            for (let c of event.attackingPlayer.battlefield) {
                if (attackers.includes(c)) {


                    // attackers.forEach((c) => {
                    this.attackState.battles.push({
                        key: key,
                        attacker: c,
                        attackerClone: c.createSnapshot(),
                        target: this.attackState.target,
                        guard: null,
                        counter: false,
                        resolved: false
                    });
                    c.isAttacker = true;
                    c.wasAttacker = true;
                    key++;
                }
            }

            if (!event.attackingPlayer.opponent.optionSettings.noAttackAlerts) {
                this.queueUserAlert(this.getFrameworkContext(event.attackingPlayer), {
                    timed: true,
                    style: 'danger',
                    promptTitle: (this.attackState.isPBAttack ? 'PB ' : 'UNIT ') + 'ATTACK!',
                    menuTitle: this.attackState.target.name + ' is being attacked',
                    controls: [
                        {
                            type: 'targeting',
                            source: this.attackState.target.getShortSummary()
                            // ,
                            // targets: [attackState.target.getShortSummary()]
                        }
                    ]
                });
            }

            this.gameLog.push({
                id: 'cl' + this.getCardLogIndex(),
                act: 'attack',
                obj: this.attackState.target,
                player: attackingPlayer
            });
            this.saveReplayState('attackers-declared');
        });
    }

    logMeditation(player) {
        this.gameLog.push({
            id: 'cl' + this.getCardLogIndex(),
            act: 'med',
            obj: player
        });
    }

    logPlayerPass(player) {
        this.gameLog.push({
            id: 'cl' + this.getCardLogIndex(),
            act: 'pass',
            obj: player
        });
        // do chat log too
        this.addAlert('info', '{0} PASSES their main action', player);
    }

    initiateAttack(target, attacker) {
        if (PhoenixbornTypes.includes(target.type)) {
            this.initiatePBAttack(target, attacker);
        } else {
            this.initiateUnitAttack(target, attacker);
        }
    }

    initiateUnitAttack(target, attacker = null, ignoreMainCost = false) {
        this.queueStep(new AttackFlow(this, target, attacker, ignoreMainCost));
    }

    initiatePBAttack(target, attacker) {
        this.queueStep(new AttackFlow(this, target, attacker));
    }

    setAttackState(attack) {
        this.attackState = attack;
    }

    clearAttackState() {
        this.attackState = null;
        this.checkGameState(true);
    }

    /*
     * This information is all logged when a game is won
     */
    getSaveState() {
        let players = this.getPlayers().map((player) => {
            const p = {
                deck: player.phoenixborn.name,
                deckid: player.deckData._id,
                name: player.name,
                turn: player.turn,
                wins: player.wins,
                wounds: player.phoenixborn.damage,
                medCount: player.medCount,
                totalDiceSpend: player.totalDiceSpend
            };
            if (player.isDummy) {
                p.level = this.soloLevel;
                p.stage = this.soloStage;
            }
            if (player.disconnectedAt) {
                p.disconnectedAt = player.disconnectedAt;
            }
            return p;
        });

        const state = {
            id: this.savedGameId,
            label: this.label,
            gameId: this.id,
            gamePrivate: this.gamePrivate,
            gameFormat: this.gameFormat,
            gameType: this.gameType,
            players: players,
            startedAt: this.startedAt,
            finishedAt: this.finishedAt,
            round: this.round,
            winReason: this.winReason,
            winner: this.winner ? this.winner.name : undefined,
            swap: this.swap,
            solo: this.solo,
            // one of the phx / ffl league games?
            league: this.league,
            pairingId: this.pairing?.id,
            saveReplay: this.saveReplay
        };

        try {
            state.chat = this.gameChat.getChatAsText();
        } catch (error) {
            state.chat = 'ERROR:' + error.message;
        }

        return state;
    }

    getSummary(options = {}) {
        let playerSummaries = {};

        for (const player of this.getPlayers()) {
            if (player.left) {
                continue;
            }

            playerSummaries[player.name] = {
                id: player.id,
                left: player.left,
                lobbyId: player.lobbyId,
                name: player.name,
                owner: player.owner,
                user: options.fullData && player.user,
                wins: player.wins
            };
        }

        return {
            allowSpectators: this.allowSpectators,
            createdAt: this.createdAt,
            gameFormat: this.gameFormat,
            gamePrivate: this.gamePrivate,
            gameType: this.gameType,
            id: this.id,
            label: this.label,
            manualMode: this.manualMode,
            messages: this.gameChat.messages,
            muteSpectators: this.muteSpectators,
            name: this.name,
            owner: this.owner,
            players: playerSummaries,
            showHand: this.showHand,
            openHands: this.openHands,
            spectators: this.getSpectators().map((spectator) => {
                return {
                    id: spectator.id,
                    lobbyId: spectator.lobbyId,
                    name: spectator.name
                };
            }),
            started: this.started,
            startedAt: this.startedAt,
            finishedAt: this.finishedAt,
            swap: this.swap,
            winner: this.winner ? this.winner.name : undefined,
            solo: this.solo
        };
    }
}

module.exports = Game;
