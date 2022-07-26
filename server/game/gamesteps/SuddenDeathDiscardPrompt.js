const CardSelector = require('../CardSelector.js');
const GameActions = require('../GameActions.js');
const UiPrompt = require('./uiprompt.js');

class SuddenDeathDiscardPrompt extends UiPrompt {
    constructor(game) {
        super(game);
        this.choosingPlayer = game.activePlayer;
        this.context = {
            game: game,
            player: game.activePlayer
        };
        this.cardSelector = CardSelector.for({
            location: ['hand', 'spellboard'],
            controller: 'self',
            cardType: ['any']
        });
        this.canSelectDeck = this.choosingPlayer.deck.length > 0;
        this.count = 0;
        this.levelState = {};
        this.choosingPlayer.clearSelectedCards();
    }

    get isCardSelected() {
        return this.choosingPlayer.hasCardSelected();
    }

    continue() {
        // player cannot discard cards -> prompt complete, do damage
        if (
            !this.cardSelector.hasEnoughTargets(this.context) &&
            this.choosingPlayer.deck.length === 0
        ) {
            this.complete();
        }

        if (!this.isComplete()) {
            // if (!this.cardSelected) {
            this.highlightSelectableCards();
            // }
        }

        return super.continue();
    }

    onCompleted() {
        // check for damage
        const woundAmount = 2 - this.count;
        if (woundAmount > 0) {
            this.game.addMessage(
                '{0} receives {1} sudden death damage',
                this.choosingPlayer.phoenixborn,
                woundAmount
            );
            GameActions.addDamageToken({ amount: woundAmount }).resolve(
                this.choosingPlayer.phoenixborn,
                this.game.getFrameworkContext()
            );
        }
    }

    highlightSelectableCards() {
        this.choosingPlayer.setSelectableCards(this.cardSelector.getAllLegalTargets(this.context));
    }

    highlightSelectableDice() {
        this.choosingPlayer.setSelectableDice(
            this.choosingPlayer.dice.filter((d) => d.level != 'power')
        );
    }

    activeCondition(player) {
        return player === this.choosingPlayer;
    }

    get selectedCard() {
        return this.choosingPlayer.selectedCards[0];
    }

    activePrompt() {
        const buttons = [];
        let mnuText = 'Choose a card to discard';
        const controls = [];
        if (this.isCardSelected) {
            // title => 'discarding xyz'
            // button => 'confirm'
            const card = this.choosingPlayer.selectedCards[0];
            mnuText = 'Discarding ' + (card.location === 'deck' ? 'top of deck' : card.name);
            controls.push({
                type: 'targeting',
                source: this.selectedCard.getShortSummary(),
                targets: []
            });
            buttons.push({ text: 'Confirm', arg: 'confirm' });
            // 
        } else {
            // if they have cards allow top of deck discard
            if (this.choosingPlayer.deck.length) {
                buttons.push({ text: 'Top of deck', arg: 'top' });
            }
        }

        if (this.isCardSelected) {
            buttons.push({ text: 'Clear', arg: 'clear' });
        }

        return {
            selectCard: !this.isCardSelected,
            selectDie: this.isCardSelected,
            canSelectDeck: this.canSelectDeck,
            menuTitle: {
                text: mnuText
            },
            buttons: buttons,
            promptTitle: 'Sudden Death',
            controls: controls
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Opponent is discarding...' };
    }

    onCardClicked(player, card) {
        if (player !== this.choosingPlayer) {
            return false;
        }

        if (!this.cardSelector.canTarget(card, this.context)) {
            return false;
        }

        return this.selectCard(card);
    }

    onCardPileClicked(player, source) {
        if (player !== this.choosingPlayer) {
            return false;
        }

        if (source !== 'deck') {
            return false;
        }

        return this.menuCommand(player, 'top');
    }

    selectCard(card) {
        this.choosingPlayer.setSelectedCards([card]);
        return true;
    }

    menuCommand(player, arg) {
        if (arg === 'top') {
            this.isTopDeck = true;
            return this.selectCard(this.choosingPlayer.deck[0]);
        }

        if (arg === 'clear') {
            this.resetSelections(this.choosingPlayer);
            return true;
        }

        if (arg === 'confirm') {
            // discard the card
            const cards = [...this.choosingPlayer.selectedCards];
            GameActions.discard().resolve(
                this.choosingPlayer.selectedCards,
                this.game.getFrameworkContext(player)
            );

            let messageFormat = '{0} discards {1}';
            const messageArgs = [this.choosingPlayer, cards];
            if (cards[0]) {
                messageFormat = messageFormat + ' from their {2}';
                messageArgs.push(cards[0].location);
            }
            this.game.addMessage(messageFormat, ...messageArgs);

            this.count = this.count + 1;
            this.resetSelections(this.choosingPlayer);
            if (this.count === 2) {
                this.complete();
            }

            return true;
        }

        return false;
    }

    resetSelections(player) {
        this.isTopDeck = false;
        player.clearSelectedCards();
        player.clearSelectableCards();
    }

    clearSelection() {
        this.choosingPlayer.clearSelectableCards();
    }
}

module.exports = SuddenDeathDiscardPrompt;
