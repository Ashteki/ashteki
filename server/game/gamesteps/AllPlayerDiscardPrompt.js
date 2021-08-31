const AllPlayerPrompt = require('./allplayerprompt');

class AllPlayerDiscardPrompt extends AllPlayerPrompt {
    constructor(game) {
        super(game);
        this.selectedCards = {};
        this.selectableCards = {};
        game.getPlayers().forEach((player) => {
            this.selectedCards[player.name] = [];
            player.takenPrepareDiscard = false;
            player.madeDiscardChoice = false;
        });
    }

    completionCondition(player) {
        return player.takenPrepareDiscard;
    }

    continue() {
        this.game.getPlayers().forEach((player) => {
            if (player.hand.length === 0) {
                player.takenPrepareDiscard = true;
                player.madeDiscardChoice = true;
            }
        });

        if (!this.isComplete()) {
            this.highlightSelectableCards();
        }

        return super.continue();
    }

    activePrompt(player) {
        if (!player.madeDiscardChoice) {
            return {
                selectCard: false,
                menuTitle: 'Do you want to discard any cards?',
                buttons: [
                    { text: 'Yes', arg: 'yes' },
                    { text: 'No', arg: 'no' }
                ],
                promptTitle: 'Prepare phase discard'
            };
        }
        return {
            selectCard: true,
            menuTitle: 'Select cards to discard',
            buttons: [{ text: 'Done', arg: 'done' }],
            promptTitle: 'Prepare phase discard'
        };
    }

    highlightSelectableCards() {
        this.game.getPlayers().forEach((player) => {
            if (player.madeDiscardChoice && !player.takenPrepareDiscard) {
                if (!this.selectableCards[player.name]) {
                    this.selectableCards[player.name] = player.hand;
                }
                player.setSelectableCards(this.selectableCards[player.name]);
            }
        });
    }

    cardCondition(card) {
        return card.location === 'hand';
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to discard' };
    }

    onCardClicked(player, card) {
        if (!player || !this.activeCondition(player) || !player.madeDiscardChoice || !card) {
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
        if (arg === 'yes' || arg === 'no') {
            player.madeDiscardChoice = true;
            player.takenPrepareDiscard = arg === 'no';
            return player.takenPrepareDiscard;
        }

        if (arg === 'done') {
            player.clearSelectableCards();

            if (this.selectedCards[player.name].length > 0) {
                this.game.actions
                    .discard()
                    .resolve(
                        this.selectedCards[player.name],
                        this.game.getFrameworkContext(player)
                    );

                this.game.addMessage(
                    '{0} has discarded {1} cards from hand',
                    player,
                    this.selectedCards[player.name].length
                );
            } else {
                this.game.addMessage('{0} has not discarded', player);
            }

            player.clearSelectedCards();
            player.takenPrepareDiscard = true;
            return true;
        }
        return false;
    }
}

module.exports = AllPlayerDiscardPrompt;
