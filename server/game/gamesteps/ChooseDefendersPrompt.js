const { BattlefieldTypes, CardType } = require('../../constants.js');
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
            controller: this.attack.defendingPlayer,
            cardType: [...BattlefieldTypes, CardType.Phoenixborn],
            cardCondition: (card) => {
                return this.availableToBlockOrGuard(card);
            }
        });
        this.selectedCard = null;
        this.blockType = this.attack.isPBAttack ? 'block' : 'guard';
    }

    continue() {
        // skip if no attackers
        let attackers = this.attack.battles.map((b) => b.attacker);
        if (attackers.length === 0) return true;

        if (!this.isComplete()) {
            // if you don't have a card selected, then highlight options
            if (!this.selectedCard) {
                if (!this.blockersAvailable()) return true;

                this.highlightSelectableBlockers();
            } else {
                // don't highlight selectables.
                this.clearSelection();
                this.highlightAttackers();
            }
        }

        return super.continue();
    }

    blockersAvailable() {
        return this.attack.defendingPlayer.defenders.some((c) => this.availableToBlockOrGuard(c));
    }

    highlightSelectableBlockers() {
        const legalTargets = this.myCardSelector.getAllLegalTargets(this.context);
        this.choosingPlayer.setSelectableCards(legalTargets);
    }

    highlightAttackers() {
        const legalChoices = this.attack.battles
            .map((b) => b.attacker)
            .filter((a) => this.selectedCard.canBlock(a));
        this.choosingPlayer.setSelectableCards(legalChoices);
    }

    // selector methods
    availableToBlockOrGuard(defender) {
        if (this.attack.isPBAttack)
            return this.attack.battles.some((b) => this.blockTest(defender, b.attacker));
        else return this.attack.battles.some((b) => this.guardTest(defender, b.target, b.attacker));
    }

    guardTest(card, target, attacker) {
        return (
            !attacker.anyEffect('bypass') &&
            !attacker.anyEffect('preventGuard') &&
            card !== target &&
            card.canGuard(attacker)
        );
    }

    blockTest(card, attacker) {
        // guard is used for blockers too
        return (
            !attacker.anyEffect('preventblock') &&
            !this.battles.some((b) => b.guard == card) &&
            card.canBlock(attacker)
        );
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
            selectCard: !this.completed,
            controls: this.attack.isPBAttack
                ? []
                : [
                      {
                          type: 'targeting',
                          source: this.attack.battles[0].attacker.getShortSummary(),
                          targets: [this.attack.target.getShortSummary()]
                      }
                  ]
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
            if (!this.attack.isPBAttack) {
                this.attack.setGuard(this.selectedCard);
                this.game.addMessage(
                    '{0} uses {1} to guard',
                    this.choosingPlayer,
                    this.selectedCard
                );
                this.selectedCard = null;
                this.clearSelection();
                this.complete();
            }
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
                this.game.checkGameState(true);
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
