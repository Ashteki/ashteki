const CardGameAction = require('./CardGameAction');

class AddTokenAction extends CardGameAction {
    constructor(propertyFactory, type = 'damage') {
        super(propertyFactory);
        this.type = type;
    }

    setDefaultProperties() {
        this.amount = 1;
        this.showMessage = false;
    }

    setup() {
        this.name = 'addToken';
        this.targetType = ['Ally', 'Conjuration', 'Ready Spell', 'Phoenixborn', 'Alteration Spell'];

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
                    context.game.addMessage(
                        tokenEvent.amount == 1
                            ? `{0} uses {1} to place {2} {3} token on {4}`
                            : `{0} uses {1} to place {2} {3} tokens on {4}`,
                        context.player,
                        context.source,
                        tokenEvent.amount,
                        tokenEvent.type == 'damage' ? 'wound' : tokenEvent.type,
                        tokenEvent.card
                    );
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
                                    this.damageDealtEvent.destroyEvent = destroyEvent;
                                    if (this.damageDealtEvent.fightEvent) {
                                        this.damageDealtEvent.fightEvent.destroyed.push(event.card);
                                    }
                                }
                            }
                        }
                    );
                    tokenEvent.addSubEvent(killerEvent);
                }
            }
        );
    }
}

module.exports = AddTokenAction;
