const UiPrompt = require('./uiprompt.js');

class CollectTokenPrompt extends UiPrompt {
    constructor(game, properties) {
        super(game);

        this.choosingPlayer = properties.choosingPlayer || game.activePlayer;
        this.properties = properties;
        this.context = properties.context;
        this.selector = properties.selector;
        this.cardStatus = {};
    }

    continue() {
        if (!this.isComplete()) {
            this.highlightSelectableCards();
        }

        return super.continue();
    }

    highlightSelectableCards() {
        this.choosingPlayer.setSelectableCards(this.selector.getAllLegalTargets(this.context));
    }

    activeCondition(player) {
        return player === this.choosingPlayer;
    }

    activePrompt() {
        let buttons = [];
        if (this.game.manualMode) {
            buttons = buttons.concat({ text: 'Cancel Prompt', arg: 'cancel' });
        }
        buttons = buttons.concat({ text: 'Done', arg: 'done' });

        return {
            selectCard: true,
            menuTitle: 'Choose status tokens on units to use',
            buttons: buttons,
            promptTitle: { text: '{{card}}', values: { card: this.context.source.name } },

            controls: [
                {
                    type: 'targeting',
                    source: this.context.source.getShortSummary(),
                    targets: []
                }
            ]
        };
    }

    waitingPrompt() {
        return { menuTitle: this.properties.waitingPromptTitle || 'Waiting for opponent' };
    }

    onCardClicked(player, card) {
        if (player !== this.choosingPlayer) {
            return false;
        }

        if (!this.selector.canTarget(card, this.context)) {
            return false;
        }

        if (!this.selectCard(card)) {
            return false;
        }

        this.totalStatus = Object.values(this.cardStatus).reduce(
            (total, cardVal) => total + cardVal.status,
            0
        );
    }

    selectCard(card) {
        if (card.status <= 0) {
            return false;
        }

        if (!this.cardStatus[card.uuid]) {
            this.cardStatus[card.uuid] = {
                status: 1
            };
        } else {
            this.cardStatus[card.uuid].status += 1;
        }
        card.removeToken('status', 1);
        return true;
    }

    menuCommand(player, arg) {
        if (arg === 'cancel') {
            // return tokens to source(s)

            this.complete();
            return true;
        }
        if (arg === 'done') {
            this.context.tokenCount = this.totalStatus;
            this.complete();
            return true;
        }

        return false;
    }

    complete() {
        this.clearSelection();
        return super.complete();
    }

    clearSelection() {
        this.cardStatus = {};
        this.choosingPlayer.clearSelectableCards();
    }
}

module.exports = CollectTokenPrompt;
