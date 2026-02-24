const { BattlefieldTypes, CardType } = require('../../constants');
const CardGameAction = require('./CardGameAction');

class AttachConjuredAlterationAction extends CardGameAction {
    setDefaultProperties() {
        this.conjuredAlteration = null;
        this.showMessage = false;
    }

    setup() {
        this.name = 'attachConjuredAlteration';
        this.targetType = this.targetType || BattlefieldTypes;
        this.effectMsg = 'attach {1} to {0}';
        this.effectArgs = () => {
            return this.alteration;
        };
    }

    canAffect(card, context) {
        if (!context.player.archives.some((c) => c.id === this.conjuredAlteration) ||
            (this.alteration && !this.alteration.canAttach(card, context)) ||
            (card.anyEffect('cannotBeSpellTarget') && context.player !== card.controller)
        ) {
            return false;
        }

        return super.canAffect(card, context);
    }

    update(context) {
        super.update(context);
        // get upgrade card
        this.alteration = context.player.archives
            .filter((c) => c.id === this.conjuredAlteration)
            .slice(0, 1)[0];
    }

    getEvent(card, context) {
        const result = super.createEvent(
            'unnamedEvent',
            {
                card: card,
                context: context,
                alteration: this.alteration
            },
            (event) => {
                const alt = context.player.archives
                    .filter((c) => c.id === this.conjuredAlteration)
                    .slice(0, 1)[0];

                const gameAction =
                    card.type == CardType.Phoenixborn
                        ? context.game.actions.attachToPb({
                            upgrade: alt
                        })
                        : context.game.actions.attach({
                            upgrade: alt
                        });
                context.cardsAttached = context.cardsAttached ? context.cardsAttached + 1 : 1;
                context.game.addMessage('{0} attaches {1} to {2}', context.player, alt, card);
                event.addSubEvent(gameAction.getEvent(card, context));
            }
        );

        return result;
    }
}

module.exports = AttachConjuredAlterationAction;
