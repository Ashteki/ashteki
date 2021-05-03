const { BattlefieldTypes } = require('../../constants');
const CardGameAction = require('./CardGameAction');

class PutIntoPlayAction extends CardGameAction {
    setDefaultProperties() {
        this.myControl = false;
        this.opponentControls = false;
    }

    setup() {
        this.name = 'putIntoPlay';
        this.targetType = ['Ally', 'Ready Spell', 'Action Spell', 'Conjuration'];
        this.effectMsg = 'put {0} into play';
    }

    canAffect(card, context) {
        if (!context || !super.canAffect(card, context)) {
            return false;
        } else if (!context.player) {
            return false;
        } else if (card.location === 'play area' || card.location === 'spellboard') {
            return false;
        }

        return true;
    }

    getEvent(card, context) {
        return super.createEvent('onCardEntersPlay', { card: card, context: context }, (event) => {
            let player;
            let control;
            if (
                (this.opponentControls || card.anyEffect('entersPlayUnderOpponentsControl')) &&
                card.owner.opponent
            ) {
                player = card.owner.opponent;
                control = true;
            } else {
                player = this.myControl ? context.player : card.controller;
                control = this.myControl;
            }

            if (BattlefieldTypes.includes(card.type) && player.isBattlefieldFull()) {
                context.game.addMessage(
                    '{1} cannot be put into play because the battlefield is full',
                    player,
                    card
                );
                event.cancel();
                event.unable = true;
                return;
            }

            player.moveCard(card, card.type.includes('Spell') ? 'spellboard' : 'play area', {
                myControl: control
            });

            if (this.myControl) {
                card.updateEffectContexts();
            }

            // if (event.context.game.lastCardPlayed !== card) {
            event.context.game.cardPlayed(card);
            // }
        });
    }
}

module.exports = PutIntoPlayAction;
