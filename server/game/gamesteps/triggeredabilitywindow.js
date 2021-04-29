const _ = require('underscore');
const { BluffAbilityTypes } = require('../../constants.js');

const ForcedTriggeredAbilityWindow = require('./forcedtriggeredabilitywindow.js');
const TriggeredAbilityWindowTitles = require('./triggeredabilitywindowtitles.js');

class TriggeredAbilityWindow extends ForcedTriggeredAbilityWindow {
    constructor(game, abilityType, window, eventsToExclude = []) {
        super(game, abilityType, window, eventsToExclude);
        this.complete = false;
        this.prevPlayerPassed = false;
    }

    pass(player, arg) {
        if (arg === 'pauseRound') {
            player.noTimer = true;
            player.resetTimerAtEndOfRound = true;
        }

        if (this.prevPlayerPassed || !this.currentPlayer || !this.currentPlayer.opponent) {
            this.complete = true;
        } else {
            this.currentPlayer = this.currentPlayer.opponent;
            this.prevPlayerPassed = true;
        }

        return true;
    }

    filterChoices() {
        // If both players have passed, close the window
        if (this.complete || !this.currentPlayer) {
            return true;
        }

        // remove any choices which involve the current player canceling their own abilities
        if (BluffAbilityTypes.includes(this.abilityType)) {
            this.choices = this.choices.filter(
                (context) =>
                    !(
                        context.player === this.currentPlayer &&
                        context.event.name === 'onCardAbilityInitiated' &&
                        context.event.context.player === this.currentPlayer
                    )
            );
        }

        // if the current player has no available choices in this window, check to see if they should get a bluff prompt
        if (
            !_.any(
                this.choices,
                (context) =>
                    context.player === this.currentPlayer &&
                    context.ability.isInValidLocation(context)
            )
        ) {
            if (this.showBluffPrompt(this.currentPlayer)) {
                this.promptWithBluffPrompt(this.currentPlayer);
                return false;
            }

            // Otherwise pass
            this.pass();
            return this.filterChoices();
        }

        // Filter choices for current player, and prompt
        this.choices = _.filter(
            this.choices,
            (context) =>
                context.player === this.currentPlayer && context.ability.isInValidLocation(context)
        );
        this.promptBetweenSources(this.choices);
        return false;
    }

    resolveAbility(context) {
        this.prevPlayerPassed = false;
        this.currentPlayer = this.currentPlayer.opponent || this.currentPlayer;
        super.resolveAbility(context);
    }

    getPromptForSelectProperties() {
        return _.extend(super.getPromptForSelectProperties(), {
            selectCard: true,
            buttons: [{ text: 'Pass', arg: 'pass' }],
            onMenuCommand: (player, arg) => {
                this.pass(player, arg);
                return true;
            }
        });
    }

    // eslint-disable-next-line no-unused-vars
    showBluffPrompt(player) {
        // Show a bluff prompt if we're in Step 6, the player has the approriate setting, and there's an event for the other player
        return (
            BluffAbilityTypes.includes(this.abilityType) &&
            // player.timerSettings.events && // not sure what this does
            _.any(
                this.events,
                (event) =>
                    event.name === 'onCardEntersPlay' &&
                    this.abilityType === 'reaction' &&
                    event.context && event.context.player !== player
                // event.card.type === 'event' &&
            )
        );
    }

    promptWithBluffPrompt(player) {
        this.game.promptWithMenu(player, this, {
            source: 'Triggered Abilities',
            waitingPromptTitle: 'Waiting for opponent',
            activePrompt: {
                promptTitle: TriggeredAbilityWindowTitles.getTitle(this.abilityType, this.events),
                controls: this.getPromptControls(this.events),
                buttons: [
                    { timer: true, method: 'pass' },
                    { text: 'I need more time', timerCancel: true },
                    {
                        text: "Don't ask again until end of round",
                        timerCancel: true,
                        method: 'pass',
                        arg: 'pauseRound'
                    },
                    { text: 'Pass', method: 'pass' }
                ]
            }
        });
    }
}

module.exports = TriggeredAbilityWindow;
