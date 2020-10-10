const SingleCardSelector = require('../CardSelectors/SingleCardSelector.js');
const SingleDieSelector = require('../CardSelectors/SingleDieSelector.js');
const UiPrompt = require('./uiprompt.js');

class MeditatePrompt extends UiPrompt {
    constructor(game) {
        super(game);

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
            location: ['hand', 'deck', 'spellboard'],
            controller: game.activePlayer,
            cardType: ['any'],
            cardCondition: () => true
        });

        this.count = 0;
    }

    get cardSelected() {
        return this.choosingPlayer.hasCardSelected();
    }

    continue() {
        if (!this.isComplete()) {
            if (!this.cardSelected) {
                this.highlightSelectableCards();
            } else {
                this.highlightSelectableDice();
            }
        }

        return super.continue();
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

    activePrompt() {
        let buttons = [{ text: 'Done', arg: 'done' }];

        let mnuText = 'Choose a card to discard';
        if (this.cardSelected) {
            mnuText = 'Choose a die to raise';
        }

        return {
            selectCard: !this.cardSelected,
            selectDie: this.cardSelected,
            // selectOrder: false,
            menuTitle: {
                text: mnuText
            },
            buttons: buttons,
            promptTitle: 'Meditate'
            // controls: [
            //     {
            //         type: 'targeting',
            //         source: this.context.source.getShortSummary(),
            //         targets: []
            //     }
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent' };
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
        this.choosingPlayer.discardSelectedCards();
        die.level = 'power';
        this.count = this.count++;
        this.resetSelections(this.choosingPlayer);
        return true;
    }

    menuCommand(player, arg) {
        if (arg === 'done') {
            this.game.addMessage('{0} meditated {1} cards/dice', player, this.count);

            this.resetSelections(player);

            this.complete();
            return true;
        }
        return false;
    }

    resetSelections(player) {
        player.clearSelectedCards();
        player.clearSelectableCards();
        player.clearSelectedDice();
        player.clearSelectableDice();
    }

    clearSelection() {
        this.cardDamage = {};
        this.choosingPlayer.clearSelectableCards();
    }
}

module.exports = MeditatePrompt;
