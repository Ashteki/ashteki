const { CardType, Level, AspectTypes } = require('../../constants');
const AbilityDsl = require('../abilitydsl');
const RevealBehaviour = require('../BaseActions/RevealBehaviour');
const Player = require('../player');
const ChimeraDefenceStrategy = require('./ChimeraDefenceStrategy');
const ChimeraFFStrategy = require('./ChimeraFFStrategy');
const ChimeraPinStrategy = require('./ChimeraPinStrategy');
const NullPromptStrategy = require('./NullPromptStrategy');

class DummyPlayer extends Player {
    constructor(id, user, owner, game, clockdetails) {
        super(id, user, owner, game, clockdetails);
        this.firstFiveStrategy = new ChimeraFFStrategy(this);
        this.dicePinStrategy = new ChimeraPinStrategy(this);
        this.defenderStrategy = new ChimeraDefenceStrategy(this, game);
        this.disStrategy = new NullPromptStrategy(this, 'no');
        this.behaviourRoll = 0;
        this.fatigued = false;
        this.chimeraPhase = 1; // values 1-3
        this.level = game.soloLevel || 'S';
        this.stage = game.soloStage || 1;

        game.on('onCardMoved', (event) => this.cardMovedListener(event));
        game.on('onDieChange', (event) => this.dieChangeListener(event));
        game.on('onDiceRerolled', (event) => this.dieChangeListener(event));
        game.on('onCardDiscarded', (event) => this.cardDiscardedListener(event));
    }

    get chimera() {
        return this.phoenixborn;
    }

    initialise() {
        super.initialise();
        // chimera card should be set up after super init / prepare decks
        this.chimera.level = this.level;
        this.chimera.stage = this.stage;
    }

    //CAUTION: NEED BOTH OF THESE BECAUSE OF DIFFERENT USE CASES. NAMING IS UNFORTUNATE
    get aspectsInPlay() {
        return this.cardsInPlay.filter((card) => AspectTypes.includes(card.type));
    }

    getAspectsInPlay() {
        return this.unitsInPlay.filter((u) => u.type === CardType.Aspect);
    }

    getHand() {
        if (this.hand.length === 0) {
            this.doDrawCards(5);
        }
        return this.hand;
    }

    get canDiscardFromHand() {
        // forms a hand from deck when needed, so can discard if hand exists or deck has cards
        return this.hand.length > 0 || this.deck.length > 0;
    }

    cardMovedListener(event) {
        if (
            // moved from my deck
            event.card.owner === this &&
            ['deck', 'hand'].includes(event.originalLocation)
        ) {
            // if draw pile hits empty then fatigue (but not if we're moving cards to form a hand)
            if (this.deck.length === 0 && this.hand.length === 0) {
                if (!this.fatigued) {
                    this.applyFatigue();
                    const context = this.game.getFrameworkContext(this);
                    this.game.queueUserAlert(context, {
                        style: 'danger',
                        promptTitle: 'Chimera Alert',
                        menuTitle: 'Chimera is Fatigued!'
                    });
                    this.game.addAlert('info', 'Chimera is Fatigued!');
                }

                // refill deck from discard pile
                this.deckRanOutOfCards();
            }
        }
    }

    deckRanOutOfCards() {
        this.game.addMessage(
            'Chimera deck has run out of cards, so re-shuffles from discard',
            this
        );
        for (let card of this.discard) {
            this.moveCard(card, 'deck');
        }

        this.shuffleDeck();
    }

    cardDiscardedListener(event) {
        if (
            this.fatigued &&
            event.card.owner === this &&
            ['deck', 'hand'].includes(event.location)
        ) {
            this.chimera.addToken('damage', 1);
            this.game.addMessage('Chimera takes 1 fatigue damage');
        }
    }

    // THREAT CARDS are considered to be a part of the battlefield
    get threatCards() {
        return this.cardsInPlay.filter((c) => c.facedown);
    }

    applyFatigue() {
        this.fatigued = true;
        AbilityDsl.actions
            .lastingEffect({
                targetController: 'current',
                effect: AbilityDsl.effects.playerCannot('draw')
            })
            .resolve(this, this.game.getFrameworkContext(this));
    }

    dieChangeListener(event) {
        if (event.diceOwner === this && this.dice.every((d) => d.level === Level.Power)) {
            // reset all dice
            this.dice.forEach((d) => (d.level = Level.Basic));
            // add a RR token to the Chimera
            const context = this.game.getFrameworkContext(this);
            this.game.actions
                .addRedRainsToken({ showMessage: true, shortMessage: true, warnMessage: true })
                .resolve(this.phoenixborn, context);
        }
    }

    get isDummy() {
        return true;
    }

    get ffStrategy() {
        return this.firstFiveStrategy;
    }

    get discardStrategy() {
        return this.disStrategy;
    }

    get deckIsEmpty() {
        // dummy reshuffles deck from discard so effectively is never really empty
        return this.fatigued;
    }

    setupAspects() {
        this.shuffleDeck();
        const setup = this.chimera.setup;
        setup.forEach((value) => {
            const card = this.deck.find((aspect) => aspect.blood === value);
            this.moveCard(card, 'play area', { facedown: true });
        });
        this.shuffleDeck();
    }

    replenishAspects() {
        const amount = this.chimera.threat - this.aspectsInPlay.length;

        if (amount > 0) {
            this.addCardsToThreatZone(amount);
        }
    }

    addCardsToThreatZone(numCards) {
        let remainingCards = 0;

        if (numCards > this.deck.length) {
            remainingCards = numCards - this.deck.length;
            numCards = this.deck.length;
        }

        for (let card of this.deck.slice(0, numCards)) {
            this.moveCard(card, 'play area', { facedown: true });
        }

        // if re-draw occurred
        if (remainingCards > 0 && this.deck.length > 0) {
            this.game.queueSimpleStep(() => this.addCardsToThreatZone(remainingCards));
        }
    }

    returnCardToThreatZone(card) {
        card.onLeavesPlay();
        card.flip();
    }

    getAttacker(from = 'left') {
        const candidates = from === 'right' ? this.unitsInPlay.slice().reverse() : this.unitsInPlay;
        for (const card of candidates) {
            if (card.canAttack()) {
                return card;
            }
        }
        return null;
    }

    getRevealHandler() {
        const target = this.threatCards[0];
        const act = new RevealBehaviour(target);
        return () => this.game.resolveAbility(act.createContext(this));
    }

    doAttack() {
        const attacker = this.getAttacker();
        const target = this.getAttackTarget(attacker);
        this.game.initiateAttack(target, attacker);
    }

    getAttackTarget(attacker) {
        if (
            this.opponent.unitsInPlay.length === 0 ||
            attacker.type !== CardType.Aspect ||
            attacker.target === 'jaw'
        ) {
            return this.opponent.phoenixborn;
        }

        const targetUnit = this.getTargetUnit(
            attacker.target,
            (u) => !u.anyEffect('cannotBeAttackTarget')
        );

        return targetUnit || this.opponent.phoenixborn;
    }

    getTargetUnit(direction, condition) {
        const unitsCopy = [...this.opponent.unitsInPlay];
        if (direction === 'right') {
            unitsCopy.reverse();
        }

        for (const unit of unitsCopy) {
            if (condition(unit)) {
                return unit;
            }
        }

        return null;
    }

    drawCardsToHand(numCards, damageIfEmpty = false, singleCopy = false) {
        // all cards are discarded
        if (!this.cannotDraw()) {
            const context = this.game.getFrameworkContext(this);
            this.game.actions.discardTopOfDeck({ amount: numCards }).resolve(this, context);
        }

        return { cardsDrawn: 0 };
    }

    get ultimateThreshold() {
        return this.chimera.printedUltimate + this.chimera.exhaustion + this.ultimate.exhaustion;
    }

    checkUltimateThreshold() {
        return this.chimera.redRains >= this.ultimateThreshold;
    }

    advanceChimeraPhase() {
        if (this.chimeraPhase < 3) {
            this.chimeraPhase++;
            this.game.addMessage('Chimera advances to phase {0}', this.chimeraPhase);
        }
    }

    triggerUltimateAbility() {
        const ultAbility = this.ultimate.getUltimateAbility(this.chimeraPhase);
        this.game.cardUsed(this.ultimate.createSnapshot(), this);
        const context = ultAbility.createContext(this);
        this.game.resolveAbility(context);
    }
}

module.exports = DummyPlayer;
