const UiPrompt = require('../uiprompt.js');
const DiscardAction = require('../../BaseActions/DiscardAction');
const UseAction = require('../../GameActions/UseAction');
const { BattlefieldTypes, CardType } = require('../../../constants.js');

class ActionWindow extends UiPrompt {
    onCardClicked(player, card) {
        if (player === this.game.activePlayer && card.controller === player) {
            if (card.location === 'play area' || card.location === 'spellboard') {
                let useAction = new UseAction({});
                let context = this.game.getFrameworkContext(player);
                if (useAction.canAffect(card, context)) {
                    useAction.resolve(card, context);
                    this.game.queueSimpleStep(() => this.checkForPhaseEnding());
                    return true;
                }
            } else if (card.use(player)) {
                this.game.queueSimpleStep(() => this.checkForPhaseEnding());
                return true;
            }
        }

        return false;
    }

    onDieClicked(player, die) {
        if (player === this.game.activePlayer && die.owner === player) {
            if (die.use(player)) {
                this.game.queueSimpleStep(() => this.checkForPhaseEnding());
                return true;
            }
        }

        return false;
    }

    onCardDragged(player, card, from, to) {
        if (player === this.game.activePlayer && card.controller === player && from === 'hand') {
            if (to === 'play area' || to === 'spellboard') {
                let playAction = card
                    .getLegalActions(player)
                    .find((action) => action.title.includes('Play'));
                if (playAction) {
                    this.game.resolveAbility(playAction.createContext(player));
                }
            } else if (to === 'discard') {
                let discardAction = new DiscardAction(card);
                let context = discardAction.createContext(player);
                if (!discardAction.meetsRequirements(context)) {
                    this.game.resolveAbility(context);
                }
            } else {
                return false;
            }

            this.game.queueSimpleStep(() => this.checkForPhaseEnding());
            return true;
        }

        return false;
    }

    checkForPhaseEnding() {
        // a card could set this as a posthandler (see keyteki BookOfLeQ)
        if (this.game.endPhaseRightNow) {
            this.game.endPhaseRightNow = false;
            this.endActionWindow();
            return;
        }

        let omegaCard = this.game.cardsPlayed.find((card) => card.hasKeyword('omega'));
        if (omegaCard) {
            this.game.addMessage(
                '{0} played {1} which has Omega, ending this step',
                this.game.activePlayer,
                omegaCard
            );
            this.endActionWindow();
        }
    }

    canAttack() {
        return (
            this.game.activePlayer.actions.main &&
            this.game.activePlayer.cardsInPlay.some((c) => !c.exhausted)
        );
    }

    activePrompt() {
        let buttons = [
            { text: 'Attack', arg: 'attack', disabled: !this.canAttack() },
            { text: 'Meditate', arg: 'meditate', disabled: !this.game.activePlayer.actions.side },
            { text: 'End Turn', arg: 'done' }
        ];

        return {
            menuTitle: 'Choose a card to play or use',
            buttons: buttons,
            promptTitle: 'Play phase'
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent' };
    }

    menuCommand(player, choice) {
        if (choice === 'manual') {
            this.game.promptForSelect(this.game.activePlayer, {
                source: 'Manual Action',
                activePromptTitle: 'Which ability are you using?',
                location: 'any',
                controller: 'self',
                cardCondition: (card) => !card.facedown,
                onSelect: (player, card) => {
                    this.game.addMessage("{0} uses {1}'s ability", player, card);
                    return true;
                }
            });
            return true;
        }

        if (choice === 'meditate') {
            this.game.actions.meditate().resolve(player, this.game.getFrameworkContext());
        }

        if (choice === 'attack') {
            // start a fight action.
            this.game.promptForSelect(this.game.activePlayer, {
                optional: true,
                activePromptTitle: 'Select a target to attack',
                controller: 'opponent',
                cardType: [...BattlefieldTypes, CardType.Phoenixborn],
                cardCondition: (card) => !card.anyEffect('concealed'),
                onSelect: (player, card) => {
                    if (card.type == CardType.Phoenixborn) {
                        this.initiatePBAttack(card);
                    } else {
                        this.initiateUnitAttack(card);
                    }
                    return true;
                }
            });
        }

        if (choice === 'done') {
            let cards = player.cardsInPlay.concat(player.hand);
            if (player.actions.main && cards.some((card) => card.getLegalActions(player).length > 0)) {
                this.game.promptWithHandlerMenu(player, {
                    source: 'End Turn',
                    activePromptTitle: 'Pass your main action?',
                    choices: ['Yes', 'No'],
                    handlers: [() => this.endActionWindow(), () => true]
                });
            } else {
                this.endActionWindow();
            }

            return true;
        }
    }

    initiatePBAttack(target) {
        this.game.initiatePBAttack(target);
    }

    initiateUnitAttack(target) {
        this.game.initiateUnitAttack(target);
    }

    endActionWindow() {
        this.complete();
    }
}

module.exports = ActionWindow;
