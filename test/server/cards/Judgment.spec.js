describe('Judgment', function () {
    describe('on play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['hammer-knight', 'iron-worker'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'time', 'charm'],
                    hand: ['judgment', 'purge'],
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

        it('destroys every unit', function () {
            this.player1.play(this.judgment);
            this.player1.clickDie(0);
            this.player1.clickDie(1);
            this.player1.clickDone();
            this.player1.clickCard(this.purge);

            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.anchornaut);
            this.player1.clickCard(this.ironWorker);
            this.player1.clickCard(this.mistSpirit);
            expect(this.hammerKnight.location).toBe('discard');
            expect(this.anchornaut.location).toBe('discard');
            expect(this.ironWorker.location).toBe('discard');
            expect(this.mistSpirit.location).toBe('archives');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
