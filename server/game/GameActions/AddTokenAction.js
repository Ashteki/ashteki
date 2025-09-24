const { BattlefieldTypes, PhoenixbornTypes, UpgradeCardTypes, CardType } = require('../../constants');
const CardGameAction = require('./CardGameAction');

class AddTokenAction extends CardGameAction {
    constructor(propertyFactory, type = 'damage') {
        super(propertyFactory);
        this.type = type;
    }

    setDefaultProperties() {
        this.amount = 1;
        this.showMessage = false;
        this.shortMessage = false;
        this.warnMessage = false;
    }

    setup() {
        this.name = 'addToken';
        this.targetType = [
            ...BattlefieldTypes,
            ...PhoenixbornTypes,
            ...UpgradeCardTypes,
            CardType.ReadySpell
        ];

        let type = this.type;
        if (this.type === 'status') {
            type = 'status token';
        }
        if (this.type === 'damage') {
            type = 'wound';
        }
        if (this.amount > 1) {
            type += 's';
        }
        this.effectMsg = 'place ' + this.amount + ' ' + type + ' on {0}';
    }

    canAffect(card, context) {
        return (
            this.amount > 0 &&
            (card.location === 'play area' || card.location === 'spellboard') &&
            super.canAffect(card, context)
        );
    }

    getEvent(card, context) {
        return super.createEvent(
            'onAddToken',
            { card: card, context: context, amount: this.amount, type: this.type },
            (tokenEvent) => {
                if (this.showMessage) {
                    const params = this.shortMessage ? [
                        tokenEvent.amount == 1
                            ? `{0} places {1} {2} token on {3}`
                            : `{0} places {1} {2} tokens on {3}`,
                        context.player,
                        tokenEvent.amount,
                        tokenEvent.type == 'damage' ? 'wound' : tokenEvent.type,
                        tokenEvent.card
                    ] : [
                        tokenEvent.amount == 1
                            ? `{0} uses {1} to place {2} {3} token on {4}`
                            : `{0} uses {1} to place {2} {3} tokens on {4}`,
                        context.player,
                        context.source,
                        tokenEvent.amount,
                        tokenEvent.type == 'damage' ? 'wound' : tokenEvent.type,
                        tokenEvent.card
                    ];
                    if (this.warnMessage) {
                        context.game.addAlert('warning', ...params);
                    } else {
                        context.game.addMessage(...params);
                    }
                }

                card.addToken(this.type, this.amount);

                if (this.type === 'damage') {
                    tokenEvent.noGameStateCheck = true;
                    // tokenEvent.parentEvent.noGameStateCheck = true;
                    // tokenEvent.openReactionWindow = true;

                    if (tokenEvent.card.tokens.damage >= tokenEvent.card.life) {
                        // mark this card not to be destroyed by the main game state check loop
                        tokenEvent.card.skipDestroyCheck = true;
                    }
                    let killerEvent = super.createEvent(
                        'killerEvent',
                        {
                            amount: tokenEvent.amount,
                            card: tokenEvent.card,
                            context: tokenEvent.context,
                            condition: (e) => e.amount > 0,
                            noGameStateCheck: true,
                            tokenEvent: tokenEvent
                        },
                        (event) => {
                            if (
                                !event.card.moribund &&
                                event.card.tokens.damage >= event.card.life
                            ) {
                                event.tokenEvent.context.destroyedTarget = true;
                                const destroyEvent = context.game.actions
                                    .destroy({
                                        damageEvent: this.damageDealtEvent,
                                        tokenEvent: event.tokenEvent
                                    })
                                    .getEvent(
                                        event.card,
                                        context.game.getFrameworkContext(context.player)
                                    );

                                event.addSubEvent(destroyEvent);
                                if (this.damageDealtEvent) {
                                    this.damageDealtEvent.destroyed = true;
                                    this.damageDealtEvent.context.multiCounter += 1;
                                    this.damageDealtEvent.destroyEvent = destroyEvent;
                                    if (this.damageDealtEvent.fightEvent) {
                                        this.damageDealtEvent.fightEvent.destroyed.push(event.card);
                                    }
                                }
                            }
                        }
                    );

                    context.game.openEventWindow(killerEvent);
                }
            }
        );
    }
}

module.exports = AddTokenAction;
