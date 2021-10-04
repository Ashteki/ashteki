const _ = require('underscore');

const GameObject = require('./GameObject');
const Deck = require('./deck');
const ClockSelector = require('./Clocks/ClockSelector');
const PlayableLocation = require('./playablelocation');
const PlayerPromptState = require('./playerpromptstate');
const Dice = require('./dice');
const GameActions = require('./GameActions');
const { BattlefieldTypes } = require('../constants');

class Player extends GameObject {
    constructor(id, user, owner, game, clockdetails) {
        super(game);
        this.user = user;
        this.emailHash = this.user.emailHash;
        this.id = id;
        this.owner = owner;

        this.hand = [];
        this.cardsInPlay = []; // This stores references to all allies and conjurations in play.  Upgrades are not stored here.
        this.spellboard = []; // all spells played to board
        this.discard = [];
        this.purged = [];
        this.archives = [];
        this.wins = 0;

        this.deckData = {};
        this.firstFiveChosen = false;
        this.recoveryDicePinned = false;
        this.pinnedDice = [];
        this.firstFive = [];
        this.diceHistory = [];

        this.clock = ClockSelector.for(this, clockdetails);
        this.disconnectedAt = undefined;

        this.maxLimited = 1;
        this.limitedPlayed = 0;
        this.showDeck = false;
        this.role = user.role;
        this.avatar = user.avatar;

        this.playableLocations = [new PlayableLocation('play', this, 'hand')];
        this.optionSettings = user.settings.optionSettings;

        this.promptState = new PlayerPromptState(this);

        this.dice = [];
        this.diceCounts = [];
        this.firstPlayer = false;
    }

    get name() {
        return this.user.username;
    }

    get type() {
        return 'player';
    }

    isSpectator() {
        return false;
    }

    canPlayLimited() {
        return this.limitedPlayed < this.maxLimited;
    }

    startClock() {
        this.clock.start();
        if (this.opponent) {
            this.opponent.clock.opponentStart();
        }
    }

    stopClock() {
        this.clock.stop();
    }

    /**
     * Checks whether a card with a uuid matching the passed card is in the passed Array
     * @param {Array} list
     * @param card
     */
    isCardUuidInList(list, card) {
        return list.some((c) => {
            return c.uuid === card.uuid;
        });
    }

    get defenders() {
        return this.cardsInPlay.concat(this.phoenixborn);
    }

    /**
     * Checks whether a card with a name matching the passed card is in the passed list
     * @param {Array} list
     * @param card
     */
    isCardNameInList(list, card) {
        return list.some((c) => {
            return c.name === card.name;
        });
    }

    /**
     * Checks whether any cards in play are currently marked as selected
     */
    areCardsSelected() {
        return this.cardsInPlay.some((card) => {
            return card.selected;
        });
    }

    /**
     * Removes a card with the passed uuid from a list. Returns an Array
     * @param list
     * @param {String} uuid
     */
    removeCardByUuid(list, uuid) {
        list = list.filter((card) => card.uuid !== uuid);
        return list;
    }

    /**
     * Returns an Array of all characters and upgrades matching the predicate controlled by this player
     * @param {Function} predicate  - DrawCard => Boolean
     */
    filterCardsInPlay(predicate) {
        return this.game.allCards.filter(
            (card) => card.controller === this && card.location === 'play area' && predicate(card)
        );
    }

    /**
     * Returns the total number of characters and upgrades controlled by this player which match the passed predicate
     * @param {Function} predicate - DrawCard => Int
     */
    getNumberOfCardsInPlay(predicate) {
        return this.game.allCards.reduce((num, card) => {
            if (card.controller === this && card.location === 'play area' && predicate(card)) {
                return num + 1;
            }

            return num;
        }, 0);
    }

    /**
     * Checks whether the passes card is in a legal location for the passed type of play
     * @param card
     * @param {String} playingType
     */
    isCardInPlayableLocation(card, playingType) {
        return _.any(
            this.playableLocations,
            (location) =>
                (!playingType || location.playingType === playingType) && location.contains(card)
        );
    }

    get unitsInPlay() {
        return this.cardsInPlay.filter((card) => BattlefieldTypes.includes(card.type));
    }

    /**
     * Draws the passed number of cards from the top of the deck into this players hand, shuffling if necessary
     * @param {number} numCards
     */
    drawCardsToHand(numCards, damageIfEmpty = false, singleCopy = false) {
        let remainingCards = numCards;

        for (let card of this.deck) {
            if (remainingCards == 0) break;

            // only one copy?
            if (!singleCopy || !this.hand.some((c) => c.name == card.name)) {
                this.moveCard(card, 'hand');
                remainingCards--;
            }
        }

        if (remainingCards > 0 && damageIfEmpty) {
            this.game.addMessage(
                '{0} receives {1} fatigue damage',
                this.phoenixborn,
                remainingCards
            );
            GameActions.addDamageToken({ amount: remainingCards }).resolve(
                this.phoenixborn,
                this.game.getFrameworkContext()
            );
        }
    }

    /**
     * Called when one of the players decks runs out of cards, removing 5 honor and shuffling the discard pile back into the deck
     */
    deckRanOutOfCards() {
        this.game.addMessage("{0}'s deck has run out of cards, so they shuffle", this);
        for (let card of this.discard) {
            this.moveCard(card, 'deck');
        }

        this.shuffleDeck();
    }

    isSpellboardFull(spellToAdd) {
        const spellSet = new Set(this.spellboard.map((s) => s.cardSlot));
        const spellCount = spellSet.size;
        return !spellSet.has(spellToAdd) && spellCount >= this.phoenixborn.spellboard;
    }

    isBattlefieldFull() {
        return this.cardsInPlay.filter((c) => !c.moribund).length >= this.phoenixborn.battlefield;
    }

    /**
     * Shuffles the deck, emitting an event and displaying a message in chat
     */
    shuffleDeck() {
        this.game.emitEvent('onDeckShuffled', { player: this });
        this.deck = _.shuffle(this.deck);
    }

    /**
     * Takes a decklist passed from the lobby, creates all the cards in it, and puts references to them in the relevant lists
     */
    prepareDecks() {
        let deck = new Deck(this.deckData);
        let preparedDeck = deck.prepare(this);
        this.deck = preparedDeck.cards;
        this.archives = preparedDeck.conjurations;
        this.allCards = preparedDeck.cards;
        this.diceCounts = preparedDeck.diceCounts;
        this.phoenixborn = preparedDeck.phoenixborn;
        this.dice = preparedDeck.dice;
    }

    /**
     * Called when the Game object starts the game. Creates all cards on this players decklist, shuffles the decks and initialises player parameters for the start of the game
     */
    initialise() {
        this.prepareDecks();

        this.keys = { red: false, blue: false, yellow: false };
        this.turn = 1;
        this.readyToStart = false;
        this.opponent = this.game.getOtherPlayer(this);
        this.actions = { main: true, side: 1 };
        this.phoenixborn.updateAbilityEvents('deck', 'play area');
    }

    rerollAllDice(round) {
        this.dice.forEach((die) => {
            if (!die.pinned) {
                die.level = Dice.getRandomDieLevel();
            }
            die.exhausted = false;
        });

        this.diceHistory[round] = this.dice
            .sort((a, b) => (a.uuid > b.uuid ? 1 : -1))
            .map((d) => ({ uuid: d.uuid, magic: d.magic, level: d.level }));

        this.sortDice();
        this.recoveryDicePinned = false;
    }

    pinSelectedDice() {
        this.selectedDice.forEach((die) => (die.pinned = true));
        this.recoveryDicePinned = true;
    }

    addPlayableLocation(type, player, location) {
        let playableLocation = new PlayableLocation(type, player, location);
        this.playableLocations.push(playableLocation);
        return playableLocation;
    }

    removePlayableLocation(location) {
        this.playableLocations = _.reject(this.playableLocations, (l) => l === location);
    }

    beginRound() {
        this.passedMain = false;
        this.turn = 0;
    }

    beginTurn() {
        this.cardsInPlay.forEach((c) => {
            c.new = false;
            c.wasAttacker = false;
            c.wasDefender = false;

            c.upgrades.forEach((u) => (u.new = false));
        });
        this.spellboard.forEach((c) => (c.new = false));
        this.passedMain = false;
        this.turn += 1;
        this.actions = { main: true, side: 1 };
        this.limitedPlayed = 0; // reset for my turn
        this.game.addAlert('startofturn', `Turn ${this.turn} - {0}`, this);
        if (this.game.suddenDeath) {
            this.doSuddenDeathDiscard();
        }
    }

    doSuddenDeathDiscard() {
        const discardAmount = Math.min(this.deck.length, 2);
        const woundAmount = 2 - discardAmount;
        this.game.addMessage('SUDDEN DEATH!');
        if (discardAmount > 0) {
            GameActions.discardTopOfDeck({ amount: discardAmount }).resolve(
                this,
                this.game.getFrameworkContext()
            );
        }

        if (woundAmount > 0) {
            this.game.addMessage(
                '{0} receives {1} sudden death damage',
                this.phoenixborn,
                woundAmount
            );
            GameActions.addDamageToken({ amount: woundAmount }).resolve(
                this.phoenixborn,
                this.game.getFrameworkContext()
            );
        }
    }

    endTurn() {
        this.passedMain = this.actions.main;
        if (this.passedMain) {
            this.game.addAlert('info', '{0} PASSES their main action', this);
        }
        this.limitedPlayed = 0; // reset for opponent's turn
    }

    endRound() {
        for (let card of this.cardsInPlay) {
            card.new = false;
            // remove die attachments
            this.removeDieAttachments(card);
        }
    }

    removeDieAttachments(card) {
        card.dieUpgrades.forEach((die) => {
            card.removeDieAttachment(die);
            die.exhaust();
            die.owner.dice.push(die);
            die.parent = null;
            die.moveTo('dicepool');
        });
    }

    /**
     * Gets the appropriate list for the passed location
     * @param {String} source
     */
    getSourceList(source) {
        if (source === 'play area') {
            return this.cardsInPlay;
        }

        return this[source];
    }

    /**
     * Called when a player drags and drops a card from one location on the client to another
     * @param {String} cardId - the uuid of the dropped card
     * @param {String} source
     * @param {String} target
     */
    drop(cardId, source, target) {
        let sourceList = this.getSourceList(source);
        let card = sourceList.find((card) => card.uuid === cardId);

        if (!card) {
            return;
        }

        // First, handle legal cases of drag/drop
        if (!this.game.manualMode) {
            this.game.pipeline.handleCardDragged(this, card, source, target);
        }

        // Any other dragging is only legal in manual mode, when the card is currently in source, when the source and target are different and when the target is a legal location
        if (
            !this.game.manualMode ||
            source === target ||
            !this.isLegalLocationForCard(card, target) ||
            card.location !== source
        ) {
            return;
        }

        let display = 'a card';
        if (
            (!card.facedown && source !== 'hand') ||
            ['play area', 'spellboard', 'discard', 'purged', 'archives'].includes(target)
        ) {
            display = card;
        }

        this.game.addAlert(
            'danger',
            '{0} manually moves {1} from their {2} to their {3}',
            this,
            display,
            source,
            target
        );
        this.moveCard(card, target);
        this.game.checkGameState(true);
    }

    /**
     * Checks whether card.type is consistent with location
     * @param card
     * @param {String} location
     */
    isLegalLocationForCard(card, location) {
        if (!card) {
            return false;
        }

        const cardLocations = ['hand', 'deck', 'discard', 'purged', 'grafted'];
        const legalLocations = {
            'Action Spell': [...cardLocations, 'being played'],
            'Alteration Spell': [...cardLocations, 'being played', 'play area'],
            'Ready Spell': [...cardLocations, 'spellboard'],
            'Reaction Spell': [...cardLocations, 'being played'],
            Ally: [...cardLocations, 'play area'],
            Conjuration: [...cardLocations, 'play area', 'archives'],
            'Conjured Alteration Spell': [...cardLocations, 'play area', 'archives']
        };

        return legalLocations[card.type] && legalLocations[card.type].includes(location);
    }

    /**
     * Called by the game when the game starts, sets the players decklist
     * @param {*} deckData
     */
    selectDeck(deckData) {
        this.deckData.selected = false;
        this.deckData = deckData;
        this.deckData.selected = true;
    }

    moveToBottom(card) {
        this.deck = this.deck.filter((c) => c !== card);
        this.deck.push(card);
    }

    /**
     * Moves a card from one location to another. This involves removing in from the list it's currently in, calling DrawCard.move (which changes
     * its location property), and then adding it to the list it should now be in
     * @param card
     * @param {String} targetLocation
     * @param {Object} options
     */
    moveCard(card, targetLocation, options = {}) {
        if (targetLocation.endsWith(' bottom')) {
            options.bottom = true;
            targetLocation = targetLocation.replace(' bottom', '');
        }

        let targetPile = this.getSourceList(targetLocation);

        if (
            !this.isLegalLocationForCard(card, targetLocation) ||
            (targetPile && targetPile.includes(card))
        ) {
            return;
        }

        this.removeCardFromPile(card);
        let location = card.location;

        // from play
        if (location === 'play area' || location === 'spellboard') {
            if (targetLocation !== 'archives' && card.owner !== this) {
                card.owner.moveCard(card, targetLocation, options);
                return;
            }

            for (let upgrade of card.upgrades) {
                upgrade.onLeavesPlay();
                upgrade.owner.moveCard(upgrade, upgrade.discardLocation);
            }

            for (let child of card.childCards) {
                child.onLeavesPlay();
                child.owner.moveCard(child, child.discardLocation);
            }

            this.removeDieAttachments(card);

            card.onLeavesPlay();
            card.controller = this;
        } else if (targetLocation === 'play area' || targetLocation === 'spellboard') {
            // into play
            if (options.myControl) {
                card.setDefaultController(this);
            }
        } else if (card.owner !== this) {
            // not in/out of play, and not mine
            card.owner.moveCard(card, targetLocation, options);
            return;
        } else if (card.location === 'archives' && card.controller !== card.owner) {
            // card is in archives, and it's not mine?
            //todo: can we remove this? i don't think it applies to ashes
            card.controller = card.owner;
            targetLocation = 'hand';
            targetPile = this.getSourceList(targetLocation);
        } else {
            card.controller = card.owner;
        }

        if (targetLocation === 'deck' && !options.bottom) {
            targetPile.unshift(card);
        } else if (['discard', 'purged'].includes(targetLocation)) {
            targetPile.unshift(card);
        } else if (targetPile) {
            targetPile.push(card);
        }

        card.moveTo(targetLocation);

        // this.game.raiseEvent('onCardPlaced', { card: card, from: location, to: targetLocation });
    }

    /**
     * Removes a card from whichever list it's currently in
     * @param card
     */
    removeCardFromPile(card) {
        if (card.parent) {
            if (card.parent.upgrades.includes(card)) {
                card.parent.upgrades = card.parent.upgrades.filter((c) => c !== card);
            } else if (card.parent.childCards.includes(card)) {
                card.parent.childCards = card.parent.childCards.filter((c) => c !== card);
            }

            card.parent = null;
            return;
        }

        if (card.controller !== this) {
            card.controller.removeCardFromPile(card);
            return;
        }

        if (card.location === 'play area') {
            this.cardsInPlay = this.cardsInPlay.filter((c) => c !== card);
        } else if (this[card.location]) {
            this[card.location] = this[card.location].filter((c) => c !== card);
        }
    }

    /**
     * Removes a die from whichever list it's currently in
     * @param die
     */
    removeDieFromPool(die) {
        if (die.parent) {
            if (die.parent.dieUpgrades.includes(die)) {
                die.parent.dieUpgrades = die.parent.dieUpgrades.filter((d) => d !== die);
            }

            die.parent = null;
            return;
        }

        if (die.owner !== this) {
            die.owner.removeDieFromPool(die);
            return;
        }

        this.dice = this.dice.filter((d) => d !== die);
    }

    discardSelectedCards() {
        this.promptState.selectedCards.forEach((card) => this.moveCard(card, 'discard'));
    }

    get selectedCards() {
        return this.promptState.selectedCards;
    }

    get selectedDice() {
        return this.promptState.selectedDice;
    }

    sortDice() {
        this.dice.sort((a, b) => (a.magic + a.level > b.magic + b.level ? -1 : 1));
    }

    /**
     * Sets the passed cards as selected
     * @param cards
     */
    setSelectedCards(cards) {
        this.promptState.setSelectedCards(cards);
    }

    clearSelectedCards() {
        this.promptState.clearSelectedCards();
    }

    hasCardSelected() {
        return this.promptState.selectedCards.length > 0;
    }

    hasDieSelected() {
        return this.promptState.selectedDice.length > 0;
    }

    setSelectedDice(dice) {
        this.promptState.setSelectedDice(dice);
    }

    clearSelectedDice() {
        this.promptState.clearSelectedDice();
    }

    getSelectableCards() {
        return this.promptState.selectableCards;
    }

    getSelectableDice() {
        return this.promptState.selectableDice;
    }

    setSelectableCards(cards) {
        this.promptState.setSelectableCards(cards);
    }

    clearSelectableCards() {
        this.promptState.clearSelectableCards();
    }

    setSelectableDice(dice) {
        this.promptState.setSelectableDice(dice);
    }

    clearSelectableDice() {
        this.promptState.clearSelectableDice();
    }

    getSummaryForCardList(list, activePlayer, hideWhenFaceup) {
        return list.map((card) => {
            return card.getSummary(activePlayer, hideWhenFaceup);
        });
    }

    getSummaryForDiceList(list, activePlayer, hideWhenFaceup) {
        return list.map((die) => {
            return die.getSummary(activePlayer, hideWhenFaceup);
        });
    }

    getCardSelectionState(card) {
        return this.promptState.getCardSelectionState(card);
    }

    getDieSelectionState(card) {
        return this.promptState.getDieSelectionState(card);
    }

    currentPrompt() {
        return this.promptState.getState();
    }

    setPrompt(prompt) {
        this.promptState.setPrompt(prompt);
    }

    cancelPrompt() {
        this.promptState.cancelPrompt();
    }

    canAttack() {
        return this.unitsInPlay.some((c) => c.canAttack());
    }

    isTopCardShown() {
        return this.anyEffect('showTopConflictCard');
    }

    spendMainAction() {
        this.actions.main = false;
    }

    spendSideAction() {
        this.actions.side -= 1;
    }

    isHaunted() {
        return this.discard.length >= 10;
    }

    get maxHandSize() {
        return 5 + this.sumEffects('modifyHandSize');
    }

    getAdditionalCosts(context) {
        return this.getEffects('additionalCost')
            .reduce((array, costFactory) => array.concat(costFactory(context)), [])
            .filter((cost) => !!cost);
    }

    setWins(wins) {
        this.wins = wins;
    }

    getStats() {
        return {
            keys: this.keys
        };
    }

    recordHand() {
        this.firstFive = this.hand.map((c) => c.getShortSummary());
    }

    /**
     * This information is passed to the UI
     * @param {Player} activePlayer
     */

    getState(activePlayer) {
        let isActivePlayer = activePlayer === this;
        let promptState = isActivePlayer ? this.promptState.getState() : {};
        let state = {
            cardPiles: {
                archives: this.getSummaryForCardList(this.archives, activePlayer),
                cardsInPlay: this.getSummaryForCardList(this.cardsInPlay, activePlayer),
                discard: this.getSummaryForCardList(this.discard, activePlayer),
                hand: this.getSummaryForCardList(this.hand, activePlayer, true),
                purged: this.getSummaryForCardList(this.purged, activePlayer),
                spells: this.getSummaryForCardList(this.spellboard, activePlayer)
            },
            cardback: 'cardback',
            disconnected: !!this.disconnectedAt,
            activePlayer: this.game.activePlayer === this,
            id: this.id,
            left: this.left,
            name: this.name,
            numDeckCards: this.deck.length,
            numArchivesCards: this.archives.length,
            optionSettings: this.optionSettings,
            phase: this.game.currentPhase,
            stats: this.getStats(),
            timerSettings: {},
            user: {
                id: this.user.id,
                username: this.user.username,
                settings: this.user.settings,
                role: this.user.role,
                avatar: this.user.avatar,
                faveColor: this.user.faveColor
            },
            deckData: this.deckData,
            wins: this.wins,
            dice: this.getSummaryForDiceList(this.dice, activePlayer),
            diceCounts: this.diceCounts,
            actions: this.actions,
            phoenixborn: this.phoenixborn.getSummary(activePlayer),
            firstPlayer: this.firstPlayer
        };

        if (isActivePlayer) {
            let sortedDeck = this.deck.slice();
            sortedDeck.sort((a, b) => {
                if (a.id < b.id) {
                    return -1;
                } else if (a.id > b.id) {
                    return 1;
                }

                return 0;
            });
            state.cardPiles.deck = this.getSummaryForCardList(sortedDeck, activePlayer, true);
            state.firstFive = this.firstFive;
            state.diceHistory = this.diceHistory;
        }

        if (this.isTopCardShown()) {
            state.deckTopCard = this.deck[0].getSummary(activePlayer);
        }

        if (this.clock) {
            state.clock = this.clock.getState();
        }

        return _.extend(state, promptState);
    }
}

module.exports = Player;
