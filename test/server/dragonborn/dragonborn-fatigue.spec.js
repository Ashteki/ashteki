describe('Dragonborn fatigue', function () {
    describe('empty deck at recovery phase refill', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'dragonborn',
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'time', 'time'],
                    spellboard: ['summon-ash-spirit', 'summon-butterfly-monk', 'summon-orchid-dove', 'summon-orchid-dove', 'summon-orchid-dove'],
                    archives: ['orchid-dove', 'ash-spirit'],
                    deck: ['purge', 'summon-gilder'],
                    hand: ['generosity']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'scatha-kalani',
                    behaviour: 'scatha-behaviour',
                    ultimate: 'scatha-ultimate',
                    dicepool: ['dragon', 'dragon', 'dragon', 'dragon', 'dragon'],
                    discard: ['iron-scales', 'constrict', 'firebelly', 'lurk'],
                    deck: ['rampage', 'hunting-instincts', 'warcry']
                }
            });
        });

        it('stamina decreases by 1 when deck is empty', function () {
            // trim filler cards
            this.player2.player.deck = [this.rampage];
            expect(this.player2.deck.length).toBe(1);
            expect(this.player2.discard.length).toBe(4);
            expect(this.player2.stamina).toBe(3);

            this.player1.endTurn();
            this.player1.clickDie(0);
            this.player1.clickDone();

            // this.player1.clickPrompt('Ok'); // no fatigue alert
            // next turn
            expect(this.game.round).toBe(2);
            // deck is empty
            expect(this.player2.deck.length).toBe(1); // reshuffled from discard, but then played to threatzone
            expect(this.player2.threatZone.length).toBe(4); // refilled from reshuffled deck
            expect(this.player2.stamina).toBe(2);
            expect(this.player2.fatigued).toBe(false);
        });

        it('at stamina 1 dragonborn fatigues and exhausts when deck is empty', function () {
            // trim filler cards
            this.player2.player.deck = [this.rampage];
            this.player2.player.stamina = 1;
            expect(this.player2.deck.length).toBe(1);
            expect(this.player2.discard.length).toBe(4);
            expect(this.player2.stamina).toBe(1);
            expect(this.scathaKalani.exhausted).toBe(false);

            this.player1.endTurn();
            this.player1.clickDie(0);
            this.player1.clickDone();

            this.player1.clickPrompt('Ok'); // no fatigue alert
            // next turn
            expect(this.game.round).toBe(2);
            // deck is empty
            // reshuffled from discard, but then played to threatzone
            expect(this.player2.deck.length).toBe(1);
            expect(this.player2.threatZone.length).toBe(4); // refilled from reshuffled deck
            expect(this.player2.stamina).toBe(0);
            expect(this.player2.fatigued).toBe(true);
            expect(this.scathaKalani.exhausted).toBe(true);
        });
    });
});
