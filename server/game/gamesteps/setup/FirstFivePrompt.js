const _ = require('underscore');
const AllPlayerPrompt = require('../allplayerprompt');

class FirstFivePrompt extends AllPlayerPrompt {
    constructor(game) {
        super(game);
        this.selectedCards = {};
        this.selectableCards = {};
        _.each(game.getPlayers(), (player) => (this.selectedCards[player.name] = []));
    }

    completionCondition(player) {
        return player.firstFiveChosen;
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
            menuTitle: 'Choose your first five',
            buttons: [{ text: 'Done', arg: 'done' }],
            promptTitle: 'First Five'
        };
    }

    onCardClicked(player, card) {
        if (!player || !this.activeCondition(player) || !card) {
            return false;
        }
        if (!this.cardCondition(card)) {
            return false;
        }

        if (
            !this.selectedCards[player.name].includes(card) && // only add if it's not already there
            this.selectedCards[player.name].length < 5 && // only choose 5
            !this.selectedCards[player.name].some((c) => c.name == card.name) // only one copy
        ) {
            // add
            this.selectedCards[player.name].push(card);
        } else {
            // remove it
            this.selectedCards[player.name] = this.selectedCards[player.name].filter(
                (c) => c !== card
            );
        }
        player.setSelectedCards(this.selectedCards[player.name]);
    }

    highlightSelectableCards() {
        this.game
            .getPlayers()
            .filter((p) => !p.firstFiveChosen)
            .forEach((player) => {
                if (!this.selectableCards[player.name]) {
                    this.selectableCards[player.name] = player.deck;
                }
                player.setSelectableCards(this.selectableCards[player.name]);
            });
    }

    cardCondition(card) {
        return card.location === 'deck';
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to choose first five' };
    }

    menuCommand(player, arg) {
        if (arg === 'done') {
            for (const card of this.selectedCards[player.name]) {
                player.moveCard(card, 'hand');
            }

            this.game.addMessage('{0} has chosen their first five', player);

            // fill if they didin't choose 5
            player.shuffleDeck();
            this.game.actions
                .draw({ refill: true })
                .resolve(player, this.game.getFrameworkContext());

            player.clearSelectedCards();
            player.clearSelectableCards();
            player.firstFiveChosen = true;
            return true;
        }
        return false;
    }
}

module.exports = FirstFivePrompt;
