const CardGameAction = require('./CardGameAction');

class PutIntoPlayAction extends CardGameAction {
    setDefaultProperties() {
        this.left = false;
        this.deployIndex = undefined;
        this.myControl = false;
        this.ready = false;
    }

    setup() {
        this.name = 'putIntoPlay';
        this.targetType = ['Ally', 'creature', 'artifact'];
        this.effectMsg = 'put {0} into play';
    }

    canAffect(card, context) {
        if (!context || !super.canAffect(card, context)) {
            return false;
        } else if (!context.player) {
            return false;
        } else if (card.location === 'play area') {
            return false;
        }

        return true;
    }

    getEvent(card, context) {
        return super.createEvent('onCardEntersPlay', { card: card, context: context }, () => {
            let player;
            let control;
            if (card.anyEffect('entersPlayUnderOpponentsControl') && card.owner.opponent) {
                player = card.owner.opponent;
                control = true;
            } else {
                player = this.myControl ? context.player : card.controller;
                control = this.myControl;
            }

            player.moveCard(card, 'play area', {
                left: this.left,
                deployIndex: this.deployIndex,
                myControl: control
            });

            if (this.myControl) {
                card.updateEffectContexts();
            }

            // if (!this.ready && !card.anyEffect('entersPlayReady')) {
            //     card.exhaust();
            // }

            if (card.anyEffect('entersPlayStunned')) {
                card.stun();
            }

            if (card.anyEffect('entersPlayEnraged')) {
                card.enrage();
            }
        });
    }
}

module.exports = PutIntoPlayAction;
