describe('Earthquake', function () {
    describe('deals damage', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight', 'iron-worker'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'time', 'charm'],
                    hand: ['earthquake'],
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

        it('deals 4 then 1 damage to every other unit', function () {
            this.player1.play(this.earthquake);
            this.player1.clickDie(0);
            this.player1.clickDie(2);
            this.player1.clickDone();
            // 4 dam
            this.player1.clickCard(this.mistSpirit);
            // 1 dam to all
            this.player1.clickCard(this.anchornaut);
            this.player1.clickCard(this.ironWorker);
            this.player1.clickCard(this.hammerKnight);
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.hammerKnight.location).toBe('play area');
            expect(this.hammerKnight.damage).toBe(1);
            expect(this.anchornaut.location).toBe('discard');
            expect(this.ironWorker.location).toBe('play area');
            expect(this.mistSpirit.location).toBe('archives');
        });
    });
});
