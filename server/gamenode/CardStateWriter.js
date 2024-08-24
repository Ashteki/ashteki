const { ConjuredCardTypes, PhoenixbornTypes, CardType } = require('../constants');

class CardStateWriter {
    constructor(card) {
        this.card = card;
    }

    getFullSummary() {
        let state = {
            id: this.card.id,
            index: this.card.index,
            imageStub: this.card.getImageStub(),
            altArts: this.card.altArts,
            controlled: this.card.owner !== this.card.controller,
            facedown: this.card.facedown,
            location: this.card.location,
            menu: this.card.getMenu(),
            name: this.card.name,
            label: this.card.name,
            new: this.card.new,
            type: this.card.getType(),
            tokens: this.card.tokens,
            flags: this.card.getFlags(),
            acquiredEffects: this.card.getAcquiredEffects(),
            uuid: this.card.uuid,
            isAttacker: this.card.isAttacker,
            isDefender: this.card.isDefender,
            isConjuration: ConjuredCardTypes.includes(this.card.type),
            isChained: this.card.isChained,
            conjurations: this.card.conjurations //?? .map((c) => c.stub),
        };

        if (this.card.armor > 0) {
            state.armor = this.card.armor;
        }
        if (PhoenixbornTypes.includes(this.card.type)) {
            state.life = this.card.life;
            state.guarded = this.card.usedGuardThisRound;
            state.damage = this.card.damage;
        }
        if (this.card.type === CardType.ReadySpell) {
            state.cardSlot = this.card.cardSlot;
        }

        return state;
    }

    getRestrictedSummary() {
        const result = {
            controller: this.card.controller.name,
            location: this.card.location,
            facedown: true,
            uuid: this.card.uuid,
            isConjuration: ConjuredCardTypes.includes(this.card.type)
        };
        if (this.card.blood) {
            result.blood = this.card.blood;
        }
        return result;
    }
}

module.exports = CardStateWriter;
