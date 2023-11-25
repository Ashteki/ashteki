const { BattlefieldTypes } = require('../../constants');
const CardGameAction = require('./CardGameAction');

class PutIntoPlayAction extends CardGameAction {
    setDefaultProperties() {
        this.myControl = false;
        this.opponentControls = false;
        this.showMessage = false;
    }

    setup() {
        this.name = 'putIntoPlay';
        this.targetType = ['Ally', 'Ready Spell', 'Action Spell', 'Conjuration', 'Aspect'];
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
        const eventName = card.type.includes('Spell') ? 'onSpellbookPlayed' : 'onCardEntersPlay';
        return super.createEvent(eventName, { card: card, context: context }, (event) => {
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

            const targetLocation = card.type.includes('Spell') ? 'spellboard' : 'play area';
            player.moveCard(card, targetLocation, { myControl: control });

            if (this.showMessage) {
                context.game.addMessage('{0} puts {1} into play', player, card);
            }

            event.context.game.cardPut(card, player);
        });
    }
}

module.exports = PutIntoPlayAction;
