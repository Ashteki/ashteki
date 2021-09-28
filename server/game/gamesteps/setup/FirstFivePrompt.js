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
            buttons: [
                { text: 'Start the Game', arg: 'done' },
                { text: 'Clear first five', arg: 'clear' }
            ],
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
            if (card.location == 'deck') {
                player.moveCard(card, 'hand');
            }
            this.selectableCards[player.name] = this.selectableCards[player.name].filter(
                (c) => c.name !== card.name
            );
            this.selectableCards[player.name].push(card);
        } else {
            // remove it
            this.selectedCards[player.name] = this.selectedCards[player.name].filter(
                (c) => c !== card
            );
            if (card.location == 'hand') {
                player.moveCard(card, 'deck');
            }
            for (const c of player.deck.filter((c) => c.name == card.name)) {
                this.selectableCards[player.name].push(c);
            }
        }
        player.setSelectedCards(this.selectedCards[player.name]);
        player.setSelectableCards(this.selectableCards[player.name]);
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
        return card.location === 'deck' || card.location === 'hand';
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to choose first five' };
    }

    menuCommand(player, arg) {
        if (arg === 'clear') {
            for (const card of this.selectedCards[player.name]) {
                player.moveCard(card, 'deck');
            }
            this.selectedCards[player.name] = [];
            player.setSelectedCards(this.selectedCards[player.name]);
            this.selectableCards[player.name] = player.deck;
            player.setSelectableCards(this.selectableCards[player.name]);
        }
        if (arg === 'done') {
            for (const card of this.selectedCards[player.name]) {
                if (card.location != 'hand') {
                    player.moveCard(card, 'hand');
                }
            }

            this.game.addMessage('{0} has chosen their first five', player);

            // random fill if they didn't choose 5
            player.shuffleDeck();
            this.game.actions
                .draw({ refill: true, singleCopy: true })
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
