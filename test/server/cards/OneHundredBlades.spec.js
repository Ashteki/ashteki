describe('One Hundred Blades', function () {
    describe('deals damage', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight', 'iron-worker'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'time', 'charm'],
                    hand: ['one-hundred-blades'],
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
            this.player1.play(this.oneHundredBlades);
            this.player1.clickDie(0);
            this.player1.clickDie(2);
            this.player1.clickDone();
            // pb
            this.player1.clickCard(this.aradelSummergaard);
            // units
            this.player1.clickCard(this.anchornaut);
            this.player1.clickCard(this.mistSpirit);
            expect(this.hammerKnight.location).toBe('play area');
            expect(this.anchornaut.location).toBe('discard');
            expect(this.ironWorker.location).toBe('play area');
            expect(this.mistSpirit.location).toBe('archives');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
