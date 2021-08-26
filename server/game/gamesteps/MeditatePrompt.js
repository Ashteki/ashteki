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

        this.count = 0;
        this.levelState = {};
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
            this.game.raiseEvent('onMeditated', { firstTopOfDeck: this.firstTopOfDeck });
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
            if (!this.cardSelected && this.choosingPlayer.deck.length > 0) {
                buttons.push({ text: 'Choose top of deck', arg: 'top' });
            }
        }
        if (this.diceSelected || this.cardSelected) {
            buttons.push({ text: 'Clear selection', arg: 'clear' });
        } else {
            buttons.push({ text: 'Stop meditating', arg: 'done' });
        }

        return {
            selectCard: !this.cardSelected,
            selectDie: this.cardSelected,
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

        if (arg === 'set') {
            const cards = [...this.choosingPlayer.selectedCards];
            const dice = [...this.choosingPlayer.selectedDice];
            GameActions.discard().resolve(
                this.choosingPlayer.selectedCards,
                this.game.getFrameworkContext(player)
            );
            // this.choosingPlayer.discardSelectedCards();
            this.game.addMessage(
                '{0} meditates {1} to gain a {2}',
                this.choosingPlayer,
                cards,
                dice
            );
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

        if (arg === 'done') {
            this.game.addMessage('{0} meditated {1} cards/dice', player, this.count);

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
