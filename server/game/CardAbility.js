const { CardType } = require('../constants');
const AbilityLimit = require('./abilitylimit');
const PlayCardAction = require('./GameActions/PlayCardAction');
const ThenAbility = require('./ThenAbility');

class CardAbility extends ThenAbility {
    constructor(game, card, properties) {
        super(game, card, properties);

        this.location = properties.location || ['play area', 'spellboard'];
        this.printedAbility = properties.printedAbility === false ? false : true;

        this.limit = properties.limit || AbilityLimit.unrestricted();
        this.limit.registerEvents(game);
        this.limit.ability = this;

        if (card.getType() === CardType.ReactionSpell) {
            this.cost = this.cost.concat(card.playCost);
        }
    }

    clone() {
        const props = this.properties;
        props.printedAbility = false;
        return new CardAbility(this.game, this.card, props);
    }

    isInValidLocation(context) {
        return this.card.type === CardType.ReactionSpell
            ? context.player.isCardInPlayableLocation(context.source, 'play')
            : this.location.includes(this.card.location);
    }

    meetsRequirements(context, ignoredRequirements = []) {
        if (this.card.isBlank() && this.printedAbility) {
            return 'blank';
        }
        if (
            !this.card.checkRestrictions('triggerAbilities', context) ||
            (this.isCardPlayed() && !context.player.checkRestrictions('play', context))
        ) {
            return 'cannotTrigger';
        }

        if (this.limit.isAtMax(context.player)) {
            return 'limit';
        }

        if (this.card.isLimited() && !context.player.canPlayLimited()) {
            return 'limited';
        }

        return super.meetsRequirements(context, ignoredRequirements);
    }

    isCardPlayed() {
        return (
            this.card.type === CardType.ReactionSpell ||
            this.gameAction.some((ga) => ga instanceof PlayCardAction)
        );
    }

    addMessage(messageArgs) {
        let message = '';
        for (let i = 0; i < messageArgs.length; ++i) {
            message += `{${i}}`;
        }

        this.game.addMessage(message, ...messageArgs);
    }

    getMessageArgs(
        context,
        effectMessage = null,
        effectArgs = [],
        extraArgs = null,
        previousMessageArgs = null,
        last = false
    ) {
        let messageArgs = previousMessageArgs || [
            context.player,
            [CardType.ReactionSpell, CardType.ActionSpell].includes(context.source.type)
                ? ' plays '
                : ' uses ',
            context.source
        ];

        if (this.properties.shortMessage) {
            return messageArgs;
        }

        // effectMessage: Player1 plays Assassination
        if (effectMessage) {
            if (extraArgs) {
                if (typeof extraArgs === 'function') {
                    extraArgs = extraArgs(context);
                }

                effectArgs = effectArgs.concat(extraArgs);
            }

            // to
            if (messageArgs.indexOf(' to ') === -1) {
                messageArgs.push(' to ');
            } else {
                // appending a message
                messageArgs.push(last ? '; and ' : '; ');
            }

            // discard Stoic Gunso
            messageArgs.push({
                message: this.game.gameChat.getFormattedMessage(effectMessage, ...effectArgs)
            });
        }

        return messageArgs;
    }

    displayMessage(context) {
        if (this.properties.preferActionPromptMessage) {
            return;
        }

        // message: property overrides auto-messaging
        if (this.properties.message) {
            let messageArgs = this.properties.messageArgs;
            if (typeof messageArgs === 'function') {
                messageArgs = messageArgs(context);
            }

            if (!Array.isArray(messageArgs)) {
                messageArgs = [messageArgs];
            }

            this.game.addMessage(this.properties.message, ...messageArgs);
            return;
        }

        // effect: property prevents auto message building through gameaction effectMsg properties
        if (!this.properties.effect) {
            // use gameAction effectMsg properties
            let gameActions = this.getGameActions(context).filter((gameAction) =>
                gameAction.hasLegalTarget(context)
            );
            if (!gameActions || gameActions.length === 0) {
                this.addMessage(this.getMessageArgs(context));
            } else {
                let messageArgs = this.getMessageArgs(
                    context,
                    gameActions[0].effectMsg,
                    [gameActions[0].target],
                    gameActions[0].effectArgs
                );
                if (this.properties.effectStyle === 'append') {
                    for (let i = 1; i < gameActions.length; ++i) {
                        let gameAction = gameActions[i];
                        messageArgs = this.getMessageArgs(
                            context,
                            gameAction.effectMsg,
                            [gameAction.target],
                            gameAction.effectArgs,
                            messageArgs,
                            i === gameActions.length - 1
                        );
                    }

                    this.addMessage(messageArgs);
                } else if (this.properties.effectStyle === 'all') {
                    gameActions.forEach((gameAction) => {
                        this.addMessage(
                            this.getMessageArgs(
                                context,
                                gameAction.effectMsg,
                                [gameAction.target],
                                gameAction.effectArgs
                            )
                        );
                    });
                } else {
                    this.addMessage(messageArgs);
                }
            }
        } else {
            this.addMessage(
                this.getMessageArgs(
                    context,
                    this.properties.effect,
                    [context.target || context.source],
                    this.properties.effectArgs
                )
            );
        }
    }

    isPlay() {
        return false;
    }
}

module.exports = CardAbility;
