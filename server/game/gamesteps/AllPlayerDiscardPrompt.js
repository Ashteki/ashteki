const AllPlayerPrompt = require('./allplayerprompt');

class AllPlayerDiscardPrompt extends AllPlayerPrompt {
    constructor(game) {
        super(game);
        this.selectedCards = {};
        this.selectableCards = {};
        game.getPlayers().forEach((player) => {
            this.selectedCards[player.name] = [];
            player.takenPrepareDiscard = false;
        });
    }

    completionCondition(player) {
        return player.takenPrepareDiscard;
    }

    continue() {
        if (!this.isComplete()) {
            this.highlightSelectableCards();
        }

        return super.continue();
    }

    activePrompt() {
        return {
            selectCard: true,
            selectRing: true,
            menuTitle: 'Select cards to discard',
            buttons: [{ text: 'Done', arg: 'done' }],
            promptTitle: 'Prepare phase discard'
        };
    }

    highlightSelectableCards() {
        this.game.getPlayers().forEach((player) => {
            if (!this.selectableCards[player.name]) {
                this.selectableCards[player.name] = player.hand;
            }
            player.setSelectableCards(this.selectableCards[player.name]);
        });
    }

    cardCondition(card) {
        return card.location === 'hand';
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to discard' };
    }

    onCardClicked(player, card) {
        if (!player || !this.activeCondition(player) || !card) {
            return false;
        }
        if (!this.cardCondition(card)) {
            return false;
        }

        if (!this.selectedCards[player.name].includes(card)) {
            this.selectedCards[player.name].push(card);
        } else {
            this.selectedCards[player.name] = this.selectedCards[player.name].filter(
                (c) => c !== card
            );
        }
        player.setSelectedCards(this.selectedCards[player.name]);
    }

    menuCommand(player, arg) {
        if (arg === 'done') {
            if (this.selectedCards[player.name].length > 0) {
                for (const card of this.selectedCards[player.name]) {
                    player.moveCard(card, 'discard');
                }
                // player.drawCardsToHand(this.selectedCards[player.name].length);
                // player.shuffleConflictDeck();
                this.game.addMessage(
                    '{0} has discarded {1} cards from hand',
                    player,
                    this.selectedCards[player.name].length
                );
            } else {
                this.game.addMessage('{0} has not discarded', player);
            }

            player.clearSelectedCards();
            player.clearSelectableCards();
            player.takenPrepareDiscard = true;
            return true;
        }
        return false;
    }
}

module.exports = AllPlayerDiscardPrompt;
