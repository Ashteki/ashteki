describe('Mist Typhoon', function () {
    describe('deals damage', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight', 'iron-worker'],
                    spellboard: [],
                    dicepool: ['natural', 'illusion', 'time', 'charm'],
                    hand: ['mist-typhoon'],
                    archives: ['spark']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural', 'natural', 'ceremonial', 'charm'],
                    hand: [],
                    inPlay: ['mist-spirit', 'anchornaut']
                }
            });
        });

        it('deals damage to every opponents unit', function () {
            this.player1.play(this.mistTyphoon);
            this.player1.clickDie(0);
            this.player1.clickDie(1);
            // ordered unit damage
            this.player1.clickCard(this.anchornaut);
            this.player1.clickCard(this.mistSpirit);
            expect(this.hammerKnight.location).toBe('play area');
            expect(this.hammerKnight.damage).toBe(0);

            expect(this.anchornaut.location).toBe('discard');
            expect(this.ironWorker.location).toBe('play area');
            expect(this.mistSpirit.location).toBe('archives');

            this.player1.clickNo(); // draw a card
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
