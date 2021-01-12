const _ = require('underscore');

class PlayerPromptState {
    constructor(player) {
        this.player = player;
        this.selectCard = false;
        this.selectDie = false;
        this.selectOrder = false;
        this.menuTitle = '';
        this.promptTitle = '';
        this.buttons = [];
        this.controls = [];
        this.diceReq = [];

        this.selectableCards = [];
        this.selectableDice = [];
        this.cardDamage = {};
        this.selectedCards = [];
        this.selectedDice = [];
    }

    setSelectedCards(cards) {
        this.selectedCards = cards;
    }

    setSelectedDice(dice) {
        this.selectedDice = dice;
    }

    clearSelectedCards() {
        this.selectedCards = [];
    }

    clearSelectedDice() {
        this.selectedDice = [];
    }

    setSelectableCards(cards) {
        this.selectableCards = cards;
    }

    clearSelectableCards() {
        this.selectableCards = [];
    }

    setSelectableDice(dice) {
        this.selectableDice = dice;
    }

    clearSelectableDice() {
        this.selectableDice = [];
    }

    setPrompt(prompt) {
        this.selectCard = prompt.selectCard || false;
        this.selectDie = prompt.selectDie || false;
        this.selectOrder = prompt.selectOrder || false;
        this.cardDamage = prompt.cardDamage || {};
        this.menuTitle = prompt.menuTitle || '';
        this.promptTitle = prompt.promptTitle;
        this.buttons = _.map(prompt.buttons || [], (button) => {
            if (button.card) {
                let card = button.card;
                let properties = _.omit(button, 'card');
                return _.extend(
                    { text: card.name, arg: card.uuid, card: card.getShortSummary() },
                    properties
                );
            }

            return button;
        });
        this.controls = prompt.controls || [];
        this.diceReq = prompt.diceReq || [];
    }

    cancelPrompt() {
        this.selectCard = false;
        this.selectDie = false;
        this.cardDamage = {};
        this.menuTitle = '';
        this.buttons = [];
        this.controls = [];
    }

    getCardSelectionState(card) {
        let selectable = this.selectableCards.includes(card);
        return {
            selected: this.selectedCards && this.selectedCards.includes(card),
            selectable: selectable,
            unselectable: !selectable && this.selectCard
        };
    }

    getDieSelectionState(die) {
        let selectable = this.selectableDice.includes(die);
        return {
            selected: this.selectedDice && this.selectedDice.includes(die),
            selectable: selectable,
            unselectable: !selectable && this.selectDie
        };
    }

    getState() {
        return {
            selectCard: this.selectCard,
            selectDie: this.selectDie,
            selectOrder: this.selectOrder,
            menuTitle: this.menuTitle,
            promptTitle: this.promptTitle,
            buttons: this.buttons,
            controls: this.controls,
            diceReq: this.diceReq
        };
    }
}

module.exports = PlayerPromptState;
