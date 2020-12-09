const { BattlefieldTypes } = require('../../constants.js');
const SingleCardSelector = require('../CardSelectors/SingleCardSelector.js');
const UiPrompt = require('./uiprompt.js');

class ChooseDefendersPrompt extends UiPrompt {
    constructor(game, attack) {
        super(game);
        this.attack = attack; // AttackState
        this.battles = attack.battles; // an array of the fights that are happening
        this.choosingPlayer = attack.defendingPlayer;
        this.context = {
            game: game,
            player: game.activePlayer // defender here?
        };
        this.menuTitleText = attack.isPBAttack ? 'Choose a blocker' : 'Choose a guard?';

        this.myCardSelector = new SingleCardSelector({
            // source: this.attack.battle.attacker,
            location: ['play area'],
            controller: attack.defendingPlayer,
            cardType: BattlefieldTypes,
            cardCondition: (card) => {
                return this.availableToBlockOrGuard(card);
            }
        });
        this.selectedCard = null;
        this.blockType = this.attack.isPBAttack ? 'block' : 'guard';
    }

    continue() {
        if (!this.isComplete()) {
            // if you don't have a card selected, then highlight options
            if (!this.selectedCard) {
                this.highlightSelectableCards();
            } else {
                // don't highlight selectables.
                this.clearSelection();
            }
        }

        return super.continue();
    }

    highlightSelectableCards() {
        this.choosingPlayer.setSelectableCards(
            this.myCardSelector.getAllLegalTargets(this.context)
        );
    }

    // selector methods
    availableToBlockOrGuard(c) {
        if (this.attack.isPBAttack)
            return this.attack.battles.some((b) => this.blockTest(c, b.attacker));
        else return this.attack.battles.some((b) => this.guardTest(c, b.target, b.attacker));
    }

    guardTest(card, target, attacker) {
        return card !== target && card.canGuard(attacker);
    }

    blockTest(card, attacker) {
        // guard is used for blockers too
        return !this.battles.some((b) => b.guard == card) && card.canBlock(attacker);
    }

    // who's choosing / active?
    activeCondition(player) {
        return player === this.choosingPlayer;
    }

    activePrompt() {
        let buttons = [];
        buttons.push({ text: 'Done', arg: 'done' });

        return {
            buttons: buttons,
            promptTitle: 'Attack',
            menuTitle: this.selectedCard
                ? 'Choose which attacker to ' + this.blockType
                : this.menuTitleText,
            selectCard: !this.completed
        };
    }

    waitingPrompt() {
        return {
            menuTitle: 'Waiting for opponent to ' + this.blockType
        };
    }

    // interaction
    onCardClicked(player, card) {
        // don't let the opponent do stuff
        if (player !== this.choosingPlayer) {
            return false;
        }

        if (card.controller === this.choosingPlayer) {
            // check validity?
            if (!this.myCardSelector.canTarget(card, this.context)) {
                return false;
            }

            // do stuff with the card.
            this.selectMyCard(card);
        } else {
            if (card.isAttacker && this.selectedCard) {
                this.attack.setBlockerForAttacker(this.selectedCard, card);
                this.game.addMessage(
                    '{0} uses {1} to {2} against {3}',
                    this.choosingPlayer,
                    this.selectedCard,
                    this.blockType,
                    card
                );
                this.selectedCard = null;
                this.clearSelection();
            }
        }
    }

    selectMyCard(card) {
        this.selectedCard = card;
        this.choosingPlayer.setSelectedCards([card]);
    }

    menuCommand(player, arg) {
        if (arg === 'done') {
            this.game.addMessage('{0} has chosen defenders', player);
            this.resetSelections(player);
            this.complete();
            return true;
        }
        return false;
    }

    resetSelections(player) {
        player.clearSelectedCards();
        player.clearSelectableCards();
    }

    clearSelection() {
        this.choosingPlayer.clearSelectedCards();
        this.choosingPlayer.clearSelectableCards();
    }
}

module.exports = ChooseDefendersPrompt;
