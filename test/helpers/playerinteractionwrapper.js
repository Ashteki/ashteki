/*eslint no-console:0 */
const _ = require('underscore');

const { matchCardByNameAndPack } = require('./cardutil.js');
const { detectBinary } = require('../../server/util');
const Die = require('../../server/game/Die.js');

class PlayerInteractionWrapper {
    constructor(game, player) {
        this.game = game;
        this.player = player;

        player.noTimer = true;
    }

    get name() {
        return this.player.name;
    }

    get hand() {
        return this.player.hand;
    }

    get actions() {
        return this.player.actions;
    }

    /**
     * Sets the player's hand to contain the specified cards. Moves cards between
     * hand and conflict deck
     * @param {String|DrawCard)[]} [cards] - a list of card names, ids or objects
     */
    set hand(cards = []) {
        //Move all cards in hand to the deck
        var cardsInHand = this.hand;
        _.each(cardsInHand, (card) => this.moveCard(card, 'deck'));
        cards = this.mixedListToCardList(cards, 'deck');
        _.each(cards, (card) => this.moveCard(card, 'hand'));
    }

    /**
     * Gets all cards in play for a player
     * @return {DrawCard[]} - List of player's cards currently in play
     */
    get inPlay() {
        return this.player.cardsInPlay;
    }

    /**
     * List of objects describing characters in play and any upgrades:
     * Either as Object:
     * {
     *    card: String,
     *    fate: Integer,
     *    upgrades: String[]
     *  }
     * or String containing name or id of the card
     * @param {(Object|String)[]} newState - list of cards in play and their states
     */
    set inPlay(newState = []) {
        // First, move all cards in play back to the appropriate decks
        _.each(this.inPlay, (card) => {
            this.moveCard(card, 'deck');
        });
        // Set up each of the cards
        _.each(newState, (card) => {
            if (_.isString(card)) {
                card = this.findCardByName(card, 'deck');
            }

            this.moveCard(card, 'play area');
            card.unExhaust();
        });
    }

    /**
     * Gets all cards in play for a player
     * @return {DrawCard[]} - List of player's cards currently in play
     */
    get spellboard() {
        return this.player.spellboard;
    }

    /**
     * List of objects describing characters in spellboard and any upgrades:
     * Either as Object:
     * {
     *    card: String,
     *    fate: Integer,
     *    upgrades: String[]
     *  }
     * or String containing name or id of the card
     * @param {(Object|String)[]} newState - list of cards in play and their states
     */
    set spellboard(newState = []) {
        // First, move all cards in play back to the appropriate decks
        _.each(this.spellboard, (card) => {
            this.moveCard(card, 'deck');
        });
        // Set up each of the cards
        _.each(newState, (card) => {
            if (_.isString(card)) {
                card = this.findCardByName(card, 'deck');
            }

            this.moveCard(card, 'spellboard');
            card.unExhaust();
        });
    }

    get dicepool() {
        return this.player.dice;
    }

    set dicepool(newState = []) {
        // Set up each of the dice
        this.player.dice = [];
        _.each(newState, (d) => {
            let die;
            if (_.isString(d)) {
                die = new Die(this.player, d, 'power');
                die.setupAbilities();
            }
            this.player.dice.push(die);
        });
    }

    get deck() {
        return this.player.deck;
    }

    /**
     * Sets the contents of the conflict discard pile
     * @param {String[]} newContents - list of names of cards to be put in conflict discard
     */
    set discard(newContents = []) {
        //  Move cards to the deck
        _.each(this.discard, (card) => {
            this.moveCard(card, 'deck');
        });
        // Move cards to the discard in reverse order
        // (helps with referring to cards by index)
        _.chain(newContents)
            .reverse()
            .each((name) => {
                var card = this.findCardByName(name, 'deck');
                this.moveCard(card, 'discard');
            });
    }

    get discard() {
        return this.player.discard;
    }

    set archives(newContents = []) {
        var cardsInArchives = this.archives;
        _.each(cardsInArchives, (card) => this.moveCard(card, 'deck'));
        let cards = this.mixedListToCardList(newContents, 'deck');
        _.each(cards, (card) => this.moveCard(card, 'archives'));
    }

    get archives() {
        return this.player.archives;
    }

    get phoenixborn() {
        return this.player.phoenixborn;
    }

    get promptState() {
        return this.player.promptState;
    }

    get side() {
        return this.player.actions.side;
    }

    get opponent() {
        return this.player.opponent;
    }

    get turn() {
        return this.player.turn;
    }

    replaceLocalizedValues(title) {
        if (!title) {
            return null;
        }

        if (!title.text) {
            return title;
        }

        let result = title.text;
        if (title.values) {
            for (var key in title.values) {
                result = result.replace('{{' + key + '}}', title.values[key]);
            }
        }

        return result;
    }

    currentPrompt() {
        let currentPrompt = this.player.currentPrompt();

        // Replace variable place holders
        let menuTitle = this.replaceLocalizedValues(currentPrompt.menuTitle);
        let promptTitle = this.replaceLocalizedValues(currentPrompt.promptTitle);

        currentPrompt.menuTitle = menuTitle;
        currentPrompt.promptTitle = promptTitle;

        return currentPrompt;
    }

    get currentButtons() {
        var buttons = this.currentPrompt().buttons;
        return _.map(buttons, (button) => this.replaceLocalizedValues(button));
    }

    /**
     * Lists cards selectable by the player during the action
     * @return {DrawCard[]} - selectable cards
     */
    get currentActionTargets() {
        return this.player.promptState.selectableCards;
    }

    get currentActionDiceTargets() {
        return this.player.promptState.selectableDice;
    }

    /**
     * Lists cards currently selected by the player
     * @return {DrawCard[]} - selected cards
     */
    get selectedCards() {
        return this.player.selectedCards;
    }

    /**
     * Lists dice currently selected by the player
     */
    get selectedDice() {
        return this.player.selectedDice;
    }

    /**
     * Determines whether a player can initiate actions
     * @return {Boolean} - whether the player can initiate actions or has to wait
     */
    get canAct() {
        return !this.hasPrompt('Waiting for opponent to take an action or pass');
    }

    formatPrompt() {
        var prompt = this.currentPrompt();
        var selectableCards = this.currentActionTargets;

        if (!prompt) {
            return 'no prompt active';
        }

        return (
            prompt.menuTitle +
            '\n' +
            _.map(this.currentButtons, (button) => '[ ' + button + ' ]').join('\n') +
            '\n' +
            _.pluck(selectableCards, 'name').join('\n')
        );
    }

    findCardByName(name, locations = 'any', side) {
        return this.filterCardsByName(name, locations, side)[0];
    }

    /**
     * Filters all of a player's cards using the name and location of a card
     * @param {String} name - the name of the card
     * @param {String[]|String} [locations = 'any'] - locations in which to look for. 'provinces' = 'province 1', 'province 2', etc.
     * @param {?String} side - set to 'opponent' to search in opponent's cards
     */
    filterCardsByName(name, locations = 'any', side) {
        var matchFunc = matchCardByNameAndPack(name);
        // So that function can accept either lists or single locations
        if (locations !== 'any') {
            if (!_.isArray(locations)) {
                locations = [locations];
            }
            // 'provinces' = ['province 1', 'province 2', etc.]
        }

        try {
            var cards = this.filterCards(
                (card) =>
                    matchFunc(card.cardData) &&
                    (locations === 'any' || _.contains(locations, card.location)),
                side
            );
        } catch (e) {
            throw new Error(`Name: ${name}, Locations: ${locations}. Error thrown: ${e}`);
        }

        return cards;
    }

    findCard(condition, side) {
        return this.filterCards(condition, side)[0];
    }

    /**
     *   Filters cards by given condition
     *   @param {function(card: DrawCard)} condition - card matching function
     *   @param {String} [side] - set to 'opponent' to search in opponent's cards
     */
    filterCards(condition, side) {
        var player = this.player;
        if (side === 'opponent') {
            player = this.opponent;
        }

        var cards = player.allCards.concat(player.phoenixborn).filter(condition);
        if (cards.length === 0) {
            throw new Error(`Could not find any matching cards for ${player.name}`);
        }

        return cards;
    }

    putIntoPlay(card) {
        if (_.isString(card)) {
            card = this.findCardByName(card);
        }

        if (card.location !== 'play area') {
            this.player.moveCard(card, 'play area');
        }

        card.facedown = false;
        return card;
    }

    hasPrompt(title) {
        var currentPrompt = this.currentPrompt();
        return (
            !!currentPrompt &&
            ((currentPrompt.menuTitle &&
                currentPrompt.menuTitle.toLowerCase() === title.toLowerCase()) ||
                (currentPrompt.promptTitle &&
                    currentPrompt.promptTitle.toLowerCase() === title.toLowerCase()))
        );
    }

    hasDefaultPrompt() {
        return this.hasPrompt('Choose a card to play or use');
    }

    selectDeck(deck) {
        this.game.selectDeck(this.player.name, deck);
    }

    removeFillerCards() {
        this.player.deck = this.deck.filter((c) => c.id !== 'open-memories');
    }

    clickAttack(target) {
        this.clickPrompt('Attack');
        this.clickCard(target);
    }

    clickDone() {
        this.clickPrompt('Done');
    }

    clickPass() {
        this.clickPrompt('Pass');
    }

    clickYes() {
        this.clickPrompt('Yes');
    }

    clickNo() {
        this.clickPrompt('No');
    }

    clickPrompt(text) {
        text = text.toString();
        var currentPrompt = this.player.currentPrompt();
        var promptButton = _.find(currentPrompt.buttons, (button) => {
            return (
                (button.card && button.card.name.toLowerCase() === text.toLowerCase()) ||
                button.text.toString().toLowerCase() === text.toLowerCase()
            );
        });

        if (!promptButton) {
            throw new Error(
                // eslint-disable-next-line prettier/prettier
                `Couldn't click on "${text}" for ${this.player.name
                }. Current prompt is:\n${this.formatPrompt()}`
            );
        }

        this.game.menuButton(
            this.player.name,
            promptButton.arg,
            promptButton.uuid,
            promptButton.method
        );
        this.game.continue();
        this.checkUnserializableGameState();
    }

    clickCard(card, location = 'any', side) {
        if (_.isString(card)) {
            card = this.findCardByName(card, location, side);
        }

        this.game.cardClicked(this.player.name, card.uuid);
        this.game.continue();
        this.checkUnserializableGameState();
        return card;
    }

    clickDie(index) {
        let die = this.player.dice[index];
        this.game.dieClicked(this.player.name, die.uuid);
        this.game.continue();
        this.checkUnserializableGameState();
        return die;
    }

    clickDieUpgrade(card, index) {
        let die = card.dieUpgrades[index];
        this.game.dieClicked(this.player.name, die.uuid);
        this.game.continue();
        this.checkUnserializableGameState();
        return die;
    }

    clickOpponentDie(index) {
        let die = this.opponent.dice[index];
        this.game.dieClicked(this.player.name, die.uuid);
        this.game.continue();
        this.checkUnserializableGameState();
        return die;
    }

    clickMenu(card, menuText) {
        if (_.isString(card)) {
            card = this.findCardByName(card);
        }

        var items = _.filter(card.getMenu(), (item) => item.text === menuText);

        if (items.length === 0) {
            throw new Error(`Card ${card.name} does not have a menu item "${menuText}"`);
        }

        this.game.menuItemClick(this.player.name, card.uuid, items[0]);
        this.game.continue();
        this.checkUnserializableGameState();
    }

    selectOption(option) {
        let currentPrompt = this.player.currentPrompt();
        let promptButton = currentPrompt.buttons.find((button) => button.arg === option);

        if (!promptButton) {
            throw new Error(
                `Couldn't select an option for ${this.player.name
                }. Current prompt is:\n${this.formatPrompt()}`
            );
        }

        this.game.menuButton(this.player.name, option, promptButton.uuid, promptButton.method);
        this.game.continue();
        this.checkUnserializableGameState();
    }

    endTurn() {
        if (this.currentPrompt().menuTitle !== 'Choose a card to play or use') {
            throw new Error('Cannot end turn now');
        }

        this.clickPrompt('End Turn');
        if (this.currentPrompt().menuTitle === 'Pass your main action?') {
            this.clickPrompt('Yes');
        }
    }

    dragCard(card, targetLocation) {
        this.game.drop(this.player.name, card.uuid, card.location, targetLocation);
        this.game.continue();
        this.checkUnserializableGameState();
    }

    /**
     * Moves cards between Locations
     * @param {String|DrawCard} card - card to be moved
     * @param {String} targetLocation - location where the card should be moved
     * @param {String | String[]} searchLocations - locations where to find the
     * card object, if card parameter is a String
     */
    moveCard(card, targetLocation, searchLocations = 'any') {
        if (_.isString(card)) {
            card = this.mixedListToCardList([card], searchLocations)[0];
        }

        this.player.moveCard(card, targetLocation);
        this.game.continue();
        return card;
    }

    /**
     * Player's action of passing priority
     */
    pass() {
        if (!this.canAct) {
            throw new Error(`${this.name} can't pass, because they don't have priority`);
        }

        this.clickPrompt('Pass');
    }

    checkActions(card) {
        console.log(card.getActions().map((action) => [action.title, action.meetsRequirements()]));
    }

    fightWith(creature, target) {
        if (creature.type !== 'creature' || !this.hasDefaultPrompt()) {
            throw new Error(`${creature.name} cannot fight now`);
        }

        this.clickCard(creature);
        this.clickPrompt('Fight with this creature');
        if (target) {
            this.clickCard(target);
        }
    }

    play(card, target) {
        if (card.type === 'Ally') {
            this.playAlly(card);
        } else if (card.type === 'Alteration Spell') {
            this.clickCard(card);
            this.clickPrompt('Play this Alteration');
        } else if (card.type === 'Action Spell') {
            this.clickCard(card);
            this.clickPrompt('Play this action');
        } else if (card.type === 'Ready Spell') {
            this.clickCard(card);
            this.clickPrompt('Play this ready spell');
        }
        if (target) {
            this.clickCard(target);
        }
    }

    useAction(card) {
        this.clickCard(card);
        this.clickPrompt("Use this card's ability");
    }

    playUpgrade(upgrade, target) {
        let card = this.clickCard(upgrade, 'hand');
        this.clickPrompt('Play this Alteration');
        this.clickCard(target, 'play area');
        return card;
    }

    playAlly(card) {
        if (_.isString(card)) {
            card = this.findCardByName(card, 'hand');
        }

        this.clickCard(card, 'hand');
        this.clickPrompt('Play this Ally');

        return card;
    }

    /**
     * Converts a mixed list of card objects and card names to a list of card objects
     * @param {(DrawCard|String)[]} mixed - mixed list of cards and names or ids
     * @param {String[]|String} locations - list of locations to get card objects from
     */
    mixedListToCardList(mixed, locations = 'any') {
        if (!mixed) {
            return [];
        }

        // Yank all the non-string cards
        var cardList = _.reject(mixed, (card) => _.isString(card));
        mixed = _.filter(mixed, (card) => _.isString(card));
        // Find cards objects for the rest
        _.each(mixed, (card) => {
            //Find only those cards that aren't already in the list
            var cardObject = this.filterCardsByName(card, locations).find(
                (card) => !_.contains(cardList, card)
            );
            if (!cardObject) {
                throw new Error(`Could not find card named ${card}`);
            }

            cardList.push(cardObject);
        });

        return cardList;
    }

    checkUnserializableGameState() {
        let state = this.game.getState(this.player.name);
        let results = detectBinary(state);

        if (results.length !== 0) {
            throw new Error(
                'Unable to serialize game state back to client:\n' + JSON.stringify(results)
            );
        }
    }

    forgeKey(color) {
        if (this.hasPrompt('Which key would you like to forge?')) {
            this.clickPrompt(color);
        } else {
            throw new Error(`${this.name} does not have a forge key prompt`);
        }
    }

    unforgeKey(color) {
        if (this.hasPrompt('Which key would you like to unforge?')) {
            this.clickPrompt(color);
        } else {
            throw new Error(`${this.name} does not have an unforge key prompt`);
        }
    }

    getForgedKeys() {
        return this.player.getForgedKeys();
    }

    clearHand() {
        this.player.hand = [];
    }
}

module.exports = PlayerInteractionWrapper;
