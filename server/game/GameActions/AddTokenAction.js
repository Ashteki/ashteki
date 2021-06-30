const CardGameAction = require('./CardGameAction');

class AddTokenAction extends CardGameAction {
    constructor(propertyFactory, type = 'damage') {
        super(propertyFactory);
        this.type = type;
        this.showMessage = false;
    }

    setDefaultProperties() {
        this.amount = 1;
    }

    setup() {
        this.name = 'addToken';
        this.targetType = ['Ally', 'Conjuration', 'Ready Spell', 'Phoenixborn', 'Alteration Spell'];
        this.effectMsg = 'place ' + this.amount + ' ' + this.type + ' on {0}';
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
                        '{0} places ' + this.amount + ' ' + this.type + ' on {1}',
                        context.player,
                        tokenEvent.card
                    );
                }
                card.addToken(this.type, this.amount);

                if (this.type === 'damage') {
                    tokenEvent.noGameStateCheck = true;
                    // tokenEvent.openReactionWindow = true;

                    let killerEvent = super.createEvent(
                        'unnamedEvent',
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
