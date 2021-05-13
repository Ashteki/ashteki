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

    showBluffPrompt(player) {
        if (
            player.limitedPlayed || // reaction used already
            !(player.user.settings.bluffTimer > 0) || // no setting configured
            !BluffAbilityTypes.includes(this.abilityType) // skip forced stuff
        ) {
            return false;
        }

        // what reactions are in the deck
        let deckReactions = player.deck.reduce(
            (accumulator, card) =>
                accumulator.concat(
                    card.abilities.reactions.filter((r) => r.abilityType === this.abilityType)
                ),
            []
        );

        return _.any(
            this.events,
            (event) =>
                this.eventCanTriggerReaction(event) &&
                event.context &&
                event.context.player !== player &&
                deckReactions.some((r) => {
                    let context = r.createContext(player, event);

                    return (
                        Object.keys(r.when).includes(event.name) &&
                        r.canPayCosts(context) &&
                        r.when[event.name](event, context)
                    );
                })
        );
    }

    // this is used to limit the events that should trigger a bluff
    // some 'After X' events are reactions, but others are interrupts. This method holds that information
    eventCanTriggerReaction(event) {
        return (
            (this.abilityType === 'reaction' &&
                [
                    'onAddToken',
                    'onAttackersDeclared',
                    // 'onAbilityResolved', (copycat)
                    'onCardEntersPlay',
                    'onCardDestroyed'
                ].includes(event.name)) ||
            (this.abilityType === 'interrupt' &&
                ['onAbilityInitiated', 'onDamageDealt'].includes(event.name))
        );
    }

    promptWithBluffPrompt(player) {
        this.game.promptWithMenu(player, this, {
            source: 'Triggered Abilities',
            waitingPromptTitle: 'Waiting for opponent',
            activePrompt: {
                promptTitle: 'BLUFF Delay',
                menuTitle: TriggeredAbilityWindowTitles.getTitle(this.abilityType, this.events),
                controls: this.getPromptControls(this.events),
                buttons: [
                    { timer: true, method: 'pass' },
                    { text: 'Wait', timerCancel: true },
                    // {
                    //     text: "Don't ask again until end of round",
                    //     timerCancel: true,
                    //     method: 'pass',
                    //     arg: 'pauseRound'
                    // },
                    { text: 'Pass', method: 'pass' }
                ]
            }
        });
    }
}

module.exports = TriggeredAbilityWindow;
