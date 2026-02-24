const { BattlefieldTypes } = require('../../constants.js');
const CardSelector = require('../CardSelector.js');
const UiPrompt = require('./uiprompt.js');

class SequentialDamagePrompt extends UiPrompt {
    constructor(game, properties) {
        super(game);

        this.choosingPlayer = properties.choosingPlayer || game.activePlayer;
        this.properties = properties;
        this.context = properties.context;
        this.selector = CardSelector.for({
            cardType: properties.cardType || BattlefieldTypes,
            controller: 'opponent',
            cardCondition: (card) => this.allowRepeats || !this.chosenTargets.includes(card)
        });
        this.damageStep = properties.damageStep;
        this.numSteps = properties.numSteps;
        this.allowRepeats = properties.allowRepeats;

        this.chosenTargets = [];
    }

    continue() {
        const legalTargets = this.selector.getAllLegalTargets(this.context);

        if (legalTargets.length === 0) {
            this.complete();
        }

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

        return {
            selectCard: true,
            menuTitle: {
                text: 'Choose a card to deal {{damageStep}} damage to ({{thisStep}}/{{numSteps}})',
                values: {
                    damageStep: this.properties.damageStep.toString(),
                    thisStep: this.chosenTargets.length + 1,
                    numSteps: this.numSteps
                }
            },
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

        // resolve damage / action
        this.game.actions
            .dealDamage({ showMessage: true })
            .resolve(card, this.game.getFrameworkContext(player));

        if (this.chosenTargets.length >= this.properties.numSteps) {
            this.complete();
        }
    }

    selectCard(card) {
        if (this.allowRepeats || !this.chosenTargets.includes[card]) {
            this.chosenTargets.push(card);
            return true;
        } else {
            return false;
        }
    }

    menuCommand(player, arg) {
        if (arg === 'cancel') {
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
        this.chosenTargets = [];
        this.choosingPlayer.clearSelectableCards();
    }
}

module.exports = SequentialDamagePrompt;
