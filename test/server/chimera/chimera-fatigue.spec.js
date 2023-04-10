describe('Chimera fatigue', function () {
    describe('empty deck at recovery phase refill', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    spellboard: ['summon-butterfly-monk']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'viros-s1',
                    behaviour: 'viros-behaviour-1',
                    ultimates: ['viros-ultimate-1', 'viros-ultimate-2', 'viros-ultimate-3'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    discard: ['iron-scales', 'constrict'],
                    deck: ['rampage']
                }
            });
        });

        it('fatigue triggers when deck is empty', function () {
            // trim filler cards
            this.player2.player.deck = [this.rampage];
            expect(this.player2.deck.length).toBe(1);
            expect(this.player2.discard.length).toBe(2);
            expect(this.player2.fatigued).toBe(false);

            this.player1.endTurn();
            this.player1.clickDie(0);
            this.player1.clickDone();

            this.player1.clickPrompt('Ok'); // fatigue alert
            // next turn
            expect(this.game.round).toBe(2);
            // deck is empty
            expect(this.player2.deck.length).toBe(0);
            expect(this.player2.threatZone.length).toBe(1); // deck card is not in threat zone
            expect(this.player2.fatigued).toBe(true);
        });
    });
});
