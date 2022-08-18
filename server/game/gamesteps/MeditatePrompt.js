const { Level } = require('../../constants.js');
const SingleCardSelector = require('../CardSelectors/SingleCardSelector.js');
const SingleDieSelector = require('../CardSelectors/SingleDieSelector.js');
const Dice = require('../dice.js');
const GameActions = require('../GameActions.js');
const UiPrompt = require('./uiprompt.js');

class MeditatePrompt extends UiPrompt {
    constructor(game) {
        super(game);
        this.firstTopOfDeck = null;

        this.choosingPlayer = game.activePlayer;
        this.context = {
            game: game,
            player: game.activePlayer
        };
        this.dieSelector = new SingleDieSelector({
            dieCondition: (die) => !die.exhausted,
            owner: game.activePlayer
        });
        this.cardSelector = new SingleCardSelector({
            location: ['hand', 'spellboard'],
            controller: 'self',
            cardType: ['any'],
            // can't meditate bound cards from spellboard (hand is ok)
            cardCondition: (card) => !(card.location === 'spellboard' && card.anyEffect('bound'))
        });
        this.canSelectDeck = true;
        this.count = 0;
        this.levelState = {};
        this.prevDie = {};
        this.choosingPlayer.clearSelectedCards();
    }

    get cardSelected() {
        return this.choosingPlayer.hasCardSelected();
    }

    get diceSelected() {
        return this.choosingPlayer.hasDieSelected();
    }

    continue() {
        if (!this.isComplete()) {
            if (!this.cardSelected) {
                this.highlightSelectableCards();
            } else {
                this.highlightSelectableDice();
            }
        }

        const result = super.continue();
        if (this.isComplete()) {
            this.game.raiseEvent('onMeditated', {
                firstTopOfDeck: this.firstTopOfDeck,
                player: this.choosingPlayer
            });
        }
        return result;
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
        if (this.cardSelected) {
            mnuText = 'Choose a die to change';
            controls.push({
                type: 'targeting',
                source: this.selectedCard.getShortSummary(),
                targets: []
            });
        }
        if (this.diceSelected) {
            mnuText = 'Confirm chosen side for this die, or click again to change side / remove';
            buttons.push({ text: 'Confirm', arg: 'set' });
        } else {
            if (this.cardSelected) {
                buttons.push({ text: 'Skip die change', arg: 'skipDie' });
            } else if (this.choosingPlayer.deck.length > 0) {
                buttons.push({ text: 'Choose top of deck', arg: 'top' });
            }
        }
        if (this.diceSelected || this.cardSelected) {
            buttons.push({ text: 'Clear selection', arg: 'clear' });
        } else {
            buttons.push({ text: 'Stop meditating', arg: 'done' });
        }

        if (this.count === 0) {
            buttons.push({ text: 'Cancel', arg: 'cancel' });
        }

        return {
            selectCard: !this.cardSelected,
            selectDie: this.cardSelected,
            canSelectDeck: this.canSelectDeck,
            // selectOrder: false,
            menuTitle: {
                text: mnuText
            },
            buttons: buttons,
            promptTitle: 'Meditate',
            controls: controls
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Opponent is meditating...' };
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

    onDieClicked(player, die) {
        if (player !== this.choosingPlayer) {
            return false;
        }

        if (!player.hasCardSelected()) {
            return false;
        }

        if (!this.dieSelector.canTarget(die, this.context)) {
            return false;
        }

        if (die.owner !== this.choosingPlayer) {
            return false;
        }

        return this.selectDie(die);
    }

    selectCard(card) {
        this.choosingPlayer.setSelectedCards([card]);
        return true;
    }

    selectDie(die) {
        if (
            this.dieSelector.hasReachedLimit(this.choosingPlayer.selectedDice) &&
            !this.choosingPlayer.selectedDice.includes(die)
        ) {
            return false;
        }

        if (!this.choosingPlayer.selectedDice.includes(die)) {
            this.choosingPlayer.setSelectedDice([die]);
            this.prevDie = die.clone(); //When I tried =die, prevDie changed as the die level changed
            this.levelState[die.uuid] = die.level;
            die.level = Level.Power;
        } else {
            if (die.level === Level.Basic) {
                // remove the die
                this.removeDie(die);
            } else {
                die.level = Dice.levelDown(die.level);
            }
        }

        return true;
    }

    removeDie(die) {
        die.level = this.levelState[die.uuid];
        this.choosingPlayer.clearSelectedDice();
    }

    menuCommand(player, arg) {
        if (arg === 'top') {
            this.isTopDeck = true;
            return this.selectCard(this.choosingPlayer.deck[0]);
        }

        if (arg === 'set' || arg === 'skipDie') {
            const cards = [...this.choosingPlayer.selectedCards];
            const dice = [...this.choosingPlayer.selectedDice];
            GameActions.discard().resolve(
                this.choosingPlayer.selectedCards,
                this.game.getFrameworkContext(player)
            );

            let messageFormat = '{0} meditates {1}';
            const messageArgs = [this.choosingPlayer, cards];
            if (cards[0]) {
                messageFormat = messageFormat + ' from their {2}';
                messageArgs.push(cards[0].location);
            } else {
                messageFormat = messageFormat + ' from {2}';
                messageArgs.push('an unknown location');
            }

            if (dice.length) {
                messageFormat = messageFormat + ' to change from {3} to {4}';
                messageArgs.push(this.prevDie, dice);
            }
            this.game.addMessage(messageFormat, ...messageArgs);
            if (!this.firstTopOfDeck && this.isTopDeck) {
                this.firstTopOfDeck = this.choosingPlayer.selectedCards[0]; // should only be 1
            }
            this.count = this.count + 1;
            this.resetSelections(this.choosingPlayer);
            return true;
        }

        if (arg === 'clear') {
            this.resetDice();
            this.resetSelections(this.choosingPlayer);
            return true;
        }

        if (arg === 'done' || arg === 'cancel') {
            if (this.count > 0) {
                this.game.addMessage('{0} meditated {1} cards/dice', player, this.count);
            }
            // If they didn't meditate at all, recover the side action and reset the die
            if (this.count == 0) {
                this.resetDice();
                this.context.player.actions.side += 1;
            }

            player.sortDice();

            this.resetSelections(player);

            this.complete();
            return true;
        }
        return false;
    }

    resetDice() {
        if (this.choosingPlayer.hasDieSelected) {
            this.choosingPlayer.selectedDice.forEach((d) => {
                this.removeDie(d);
            });
        }
    }

    resetSelections(player) {
        this.isTopDeck = false;
        player.clearSelectedCards();
        player.clearSelectableCards();
        player.clearSelectedDice();
        player.clearSelectableDice();
    }

    clearSelection() {
        this.choosingPlayer.clearSelectableCards();
    }
}

module.exports = MeditatePrompt;
