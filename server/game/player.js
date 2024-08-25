const _ = require('underscore');

const GameObject = require('./GameObject');
const Deck = require('./deck');
const ClockSelector = require('./Clocks/ClockSelector');
const PlayableLocation = require('./playablelocation');
const PlayerPromptState = require('./playerpromptstate');
const GameActions = require('./GameActions');
const {
    BattlefieldTypes,
    Location,
    Level,
    PhoenixbornTypes,
    Magic,
    LegalLocations
} = require('../constants');
const moment = require('moment');

class Player extends GameObject {
    constructor(id, user, owner, game, clockdetails) {
        super(game);
        this.user = user;
        this.role = user.role;
        this.avatar = user.avatar;
        this.optionSettings = user.settings.optionSettings;

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
        this.medCount = 0;
        this.totalDiceSpend = 0;
        this.totalCardsPlayed = 0;

        this.clock = ClockSelector.for(this, clockdetails);
        this.disconnectedAt = undefined;

        this.maxLimited = 1;
        this.limitedPlayed = 0;
        this.showDeck = false;

        this.playableLocations = [new PlayableLocation('play', this, 'hand')];

        this.promptState = new PlayerPromptState(this);
        this.inspectionCard = null;

        this.dice = [];
        this.diceCounts = [];
        this.firstPlayer = false;
        this.left = false;
        this.socket = undefined;
        this.lobbyId = undefined;

        // expected win/lose based on Elo
        this.expectedScore = undefined;

        this.suddenDeath = false;
        this.loseOnTurnEnd = false;
        this.behaviourRoll = undefined;
    }

    get name() {
        return this.user.username;
    }

    get type() {
        return 'player';
    }

    get isDummy() {
        return false;
    }

    get isAwol() {
        let difference = moment().diff(moment(this.disconnectedAt), 'minutes');
        return difference > 3;
    }

    isSpectator() {
        return false;
    }

    canPlayLimited() {
        return this.limitedPlayed < this.maxLimited;
    }

    /**
     * Used for effects that target the opponent's hand. 
     * This is for DummyPlayer to override and prep chimera hand from top of deck 
     * @returns array of cards
     */
    getHand() {
        return this.hand;
    }

    startClock() {
        if (!this.clock) return;
        this.clock.start();
        if (this.opponent) {
            this.opponent.clock.opponentStart();
        }
    }

    stopClock() {
        if (!this.clock) return;
        this.clock.stop();
    }

    resetClock() {
        if (!this.clock) return;
        this.clock.reset();
    }

    getAlertTimerSetting() {
        let result = 5;
        if (this.optionSettings.alertTimer !== null) {
            result = this.optionSettings.alertTimer;
        }

        return result;
    }

    outOfTime() {
        if (!this.loseOnTurnEnd) {
            this.loseOnTurnEnd = true;
        }
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
        // can be cardsInPlay
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
        return this.unitsInPlay.some((card) => {
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
     * Returns an Array of all units and upgrades matching the predicate controlled by this player
     * @param {Function} predicate  - DrawCard => Boolean
     */
    filterCardsInPlay(predicate) {
        return this.game.allCards.filter(
            (card) => card.controller === this && card.location === 'play area' && predicate(card)
        );
    }

    /**
     * Returns the total number of units and upgrades controlled by this player which match the passed predicate
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

    // CAUTION! sort of overridden in DummyPlayer
    get unitsInPlay() {
        return this.cardsInPlay.filter(
            (card) => BattlefieldTypes.includes(card.type) && !card.facedown && !card.moribund
        );
    }

    get charmedUnits() {
        return this.unitsInPlay.filter((card) =>
            card.dieUpgrades.some((d) => d.magic === Magic.Charm)
        );
    }

    // this gets sent to the client ONLY
    // CAUTION: it includes facedown cards vs chimera
    get battlefield() {
        return this.cardsInPlay.filter(
            (card) => !PhoenixbornTypes.includes(card.type) && !card.moribund
        );
    }

    getHordeAttackers(excludeList) {
        return this.unitsInPlay.filter(
            (u) => u.anyEffect('hordeAttack') && !excludeList.includes(u) && u.canAttack()
        );
    }

    indexOf(card) {
        return this.battlefield.indexOf(card);
    }

    isRightmostUnit(card) {
        if (this.battlefield.length === 0) {
            return false;
        }
        const cardPosition = this.indexOf(card);
        if (this.battlefield.length === 1 && cardPosition === 0) {
            return true;
        }

        return cardPosition > 0 && cardPosition === this.battlefield.length - 1;
    }

    isLeftmostUnit(card) {
        return BattlefieldTypes.includes(card.type) && this.indexOf(card) === 0;
    }

    areCardsAdjacent(card, anotherCard) {
        if (anotherCard.facedown) {
            // threatzone isn't actually in the battlefield
            return false;
        }

        const cardIndex = this.battlefield.indexOf(card);
        const anotherCardIndex = this.battlefield.indexOf(anotherCard);
        if (cardIndex === -1 || anotherCardIndex === -1) {
            return false;
        }
        if (Math.abs(cardIndex - anotherCardIndex) === 1) {
            return true;
        }

        return false;
    }

    moveUnit(card, to) {
        // if to === 'right'
        const position = this.cardsInPlay.indexOf(card);
        this.cardsInPlay.splice(position, 1);
        this.cardsInPlay.push(card);
    }

    getSpendableDice(context) {
        // this assumes all spendable dice are on ready spells
        const spendableUpgrades = this.spellboard
            .filter((card) => card.dieUpgrades.length && card.canSpendDieUpgrades(context))
            .reduce((agg, card) => agg.concat(card.dieUpgrades), []);
        return this.dice.concat(spendableUpgrades);
    }

    /**
     * Draws the passed number of cards from the top of the deck into this players hand
     * @param {number} numCards
     */
    drawCardsToHand(numCards, damageIfEmpty = false, singleCopy = false) {
        let remainingCards = this.doDrawCards(numCards, singleCopy);

        const result = { cardsDrawn: numCards - remainingCards };
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
            result.damagePlaced = remainingCards;
        }
        return result;
    }

    cannotDraw() {
        return !this.checkRestrictions('draw', this.game.getFrameworkContext(this));
    }

    doDrawCards(numCards, singleCopy) {
        let remainingCards = numCards;

        for (let card of this.deck) {
            if (remainingCards == 0) break;

            // only one copy?
            if (!singleCopy || !this.hand.some((c) => c.name == card.name)) {
                this.moveCard(card, Location.Hand);
                remainingCards--;
            }
        }
        return remainingCards;
    }

    releaseHand() {
        _.shuffle(this.hand);
        for (let card of this.hand) {
            this.moveCard(card, Location.Deck);
        }
    }

    // overridden in dummyplayer
    get canDiscardFromHand() {
        return this.hand.length > 0;
    }

    canPlayToSpellboard(card) {
        const spellSet = new Set(this.spellboard.map((s) => s.cardSlot));
        const spellCount = spellSet.size;
        // resonance on empty sb
        if (card.isPlayedToExistingSpellboardSlot && spellCount === 0) {
            return false;
        }
        // is there a slot (focus play, resonance target, empty slot)
        return (
            spellSet.has(card.cardSlot) ||
            (spellCount > 0 && card.isPlayedToExistingSpellboardSlot) ||
            spellCount < this.phoenixborn.spellboard
        );
    }

    isBattlefieldFull() {
        return this.unitsInPlay.filter((c) => !c.moribund).length >= this.phoenixborn.battlefield;
    }

    get deckIsEmpty() {
        return this.deck.length === 0;
    }

    /**
     * Shuffles the deck, emitting an event and displaying a message in chat
     */
    shuffleDeck() {
        // this.game.emitEvent('onDeckShuffled', { player: this });
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
        this.cardsInPlay = [this.phoenixborn];
        if (this.deckData.ultimate) {
            this.ultimate = preparedDeck.ultimate;
            this.behaviour = preparedDeck.behaviour;
            this.spellboard = [this.ultimate, this.behaviour];
        }
        this.dice = preparedDeck.dice;
        this.deckNotes = preparedDeck.notes;
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
            die.roll();
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

            c.upgrades.forEach((u) => (u.new = false));
        });
        this.spellboard.forEach((c) => (c.new = false));
        this.passedMain = false;
        this.turn += 1;
        this.actions = { main: true, side: 1 };
        //this.limitedPlayed = 0; // reset for my turn - moved to game.js
        this.game.addAlert('startofturn', `Turn ${this.turn} - {0}`, this);
        if (this.suddenDeath) {
            this.doSuddenDeathDiscard();
        }
    }

    doSuddenDeathDiscard() {
        this.game.promptForSuddenDeathDiscard();
    }

    endTurn() {
        this.passedMain = this.actions.main;
        if (this.passedMain) {
            this.game.raiseEvent('onPlayerPass', { player: this });

            this.game.logPlayerPass(this);
        }
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

        if (source === 'deck' && target === 'hand' && !cardId) {
            // dragging top of deck for draw
            card = sourceList[0];
        }

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

        return LegalLocations[card.type] && LegalLocations[card.type].includes(location);
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
     * Moves a card from one location to another. This involves removing it from the list it's currently in, calling Card.move 
     * (which changes its location property), and then adding it to the list it should now be in
     * @param card
     * @param {String} targetLocation
     * @param {Object} options
     */
    moveCard(card, targetLocation, options = {}) {
        let targetPile = this.getSourceList(targetLocation);

        if (
            !this.isLegalLocationForCard(card, targetLocation) ||
            (targetPile && targetPile.includes(card))
        ) {
            return;
        }

        this.removeCardFromPile(card);
        let location = card.location;

        // card leaves play
        if (location === 'play area' || location === 'spellboard') {
            if (targetLocation !== 'archives' && card.owner !== this) {
                card.owner.moveCard(card, targetLocation, options);
                return;
            }

            for (let upgrade of card.upgrades) {
                upgrade.onLeavesPlay();
                upgrade.owner.moveCard(upgrade, upgrade.discardLocation);
            }

            // discard all cards under this one
            for (let child of card.childCards) {
                child.onLeavesPlay();
                child.owner.moveCard(child, child.discardLocation);
            }

            this.removeDieAttachments(card);

            card.onLeavesPlay();
        } else if (targetLocation === 'play area' || targetLocation === 'spellboard') {
            // moves into play
            if (targetLocation === 'play area' && !card.index) {
                card.index = this.game.getCardIndex();
            }
            if (options.myControl) {
                card.setDefaultController(this);
            }
        } else if (card.owner !== this) {
            // not in/out of play, and not mine
            card.owner.moveCard(card, targetLocation, options);
            return;
        } else {
            card.controller = card.owner;
        }

        if (targetLocation === 'deck' && !options.bottom) {
            targetPile.unshift(card);
        } else if (['discard', 'purged'].includes(targetLocation)) {
            targetPile.unshift(card);
        } else if (targetPile) { // 'being played' does not have a target pile
            targetPile.push(card);
        }

        card.moveTo(targetLocation, options.facedown);
    }

    placeCardUnder(card, target) {
        card.controller.removeCardFromPile(card);
        card.controller = card.owner;
        card.parent = target;
        card.moveTo('purged');
        card.facedown = true;
        target.childCards.push(card);
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
        // detach this die if attached to a card (has a parent)
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

    get activeDice() {
        return this.dice.filter(d => !d.exhausted);
    }
    get activeDiceCount() {
        return this.activeDice.length;
    }

    get activeNonBasicDice() {
        return this.dice.filter(d => !d.exhausted && d.level !== Level.Basic);
    }

    get activeNonBasicDiceCount() {
        return this.activeNonBasicDice.length;
    }

    getBasicDie(magic) {
        return this.activeDice.find((die) => die.level === Level.Basic && die.magic === magic);
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

    canSummon(stub) {
        return this.archives.some(c => c.id === stub);
    }

    spendMainAction() {
        this.actions.main = false;
    }

    spendSideAction() {
        this.actions.side -= 1;
    }

    get maxHandSize() {
        return 5;
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

    inspectCard(card) {
        this.inspectionCard = card;
    }

    clearInspector() {
        this.inspectionCard = null;
    }

    mayMoveCard(card) {
        if (card.controller === this || (this.game.manualMode && this.game.solo)) {
            return true;
        }
        return false;
    }

    canPlayCard(card) {
        // I'm the controller and there's a legal (use) action
        return !!(
            this.game.activePlayer === this &&
            card.controller === this &&
            card.getLegalActions(this).length > 0
        );
    }

    canPlayDie(die) {
        let canPlay = false;
        // using try catch to prevent more errors when saving state on Gameserver.handleError
        try {
            canPlay = !!(
                this.game.activePlayer === this &&
                this === die.owner &&
                die.getLegalActions(this).length > 0
            );
        } catch {
            // using null for error state
            canPlay = null;
        }
        return canPlay;
    }
}

module.exports = Player;
