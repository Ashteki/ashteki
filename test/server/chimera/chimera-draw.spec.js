describe('Chimera Draw', function () {
    describe('Abundance', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                allowSetup: true,
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    spellboard: ['abundance'],
                    deck: ['anchornaut', 'iron-worker']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'viros-s1',
                    behaviour: 'viros-behaviour',
                    ultimates: ['viros-ultimate-1', 'viros-ultimate-2', 'viros-ultimate-3'],
                    inPlay: [],
                    spellboard: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });
        });

        it('player chooses for chimera. draw causes discard', function () {
            const decklength = this.player2.deck.length;
            this.player1.clickCard(this.abundance);
            this.player1.clickPrompt('Abundance');
            this.player1.clickPrompt('2');
            this.player1.clickPrompt('2');

            expect(this.player2.deck.length).toBe(decklength - 2);
            expect(this.player2.hand.length).toBe(0);
            expect(this.player2.discard.length).toBe(2);
            expect(this.virosS1.damage).toBe(0);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('Abundance When Fatigued', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                allowSetup: true,
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    spellboard: ['abundance'],
                    deck: ['anchornaut', 'iron-worker']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'viros-s1',
                    behaviour: 'viros-behaviour',
                    ultimates: ['viros-ultimate-1', 'viros-ultimate-2', 'viros-ultimate-3'],
                    inPlay: [],
                    spellboard: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });
        });

        it('player does not choose, chimera cannot discard so gets damaged', function () {
            const decklength = this.player2.deck.length;
            this.player2.player.applyFatigue();
            expect(this.player2.fatigued).toBe(true);

            this.player1.clickCard(this.abundance);
            this.player1.clickPrompt('Abundance');
            this.player1.clickPrompt('2'); // self

            expect(this.player2.deck.length).toBe(decklength);
            expect(this.player2.hand.length).toBe(0);
            expect(this.player2.discard.length).toBe(0);
            expect(this.virosS1.damage).toBe(2);
            expect(this.player1).toHaveDefaultPrompt();
        });

    });

});
