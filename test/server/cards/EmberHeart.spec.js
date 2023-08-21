describe('Ember Heart', function () {
    describe('Enters Play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['mist-spirit', 'iron-worker'],
                    dicepool: ['divine', 'divine', 'charm', 'charm', 'natural', 'natural'],
                    hand: ['ember-heart', 'freezing-blast', 'clashing-tempers'],
                    archives: ['ice-buff']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight', 'holy-knight', 'anchornaut'],
                    spellboard: [],
                    hand: [],
                    dicepool: ['natural', 'natural', 'charm']
                }
            });
        });

        it('take up', function () {
            this.player1.clickCard(this.rinNorthfell);
            this.player1.clickPrompt('ice buff');
            this.player1.clickCard(this.ironWorker);
            expect(this.ironWorker.upgrades.length).toBe(1);
            this.ironWorker.tokens.exhaustion = 1; // fudge for test

            this.player1.play(this.emberHeart);
            this.player1.clickDie(0);
            this.player1.clickDone();

            this.player1.clickCard(this.iceBuff);

            expect(this.ironWorker.upgrades.length).toBe(0);
            expect(this.emberHeart.upgrades.length).toBe(1);
        });

        it('target unit must be exhausted', function () {
            this.player1.clickCard(this.rinNorthfell);
            this.player1.clickPrompt('ice buff');
            this.player1.clickCard(this.ironWorker);
            expect(this.ironWorker.upgrades.length).toBe(1);

            this.player1.play(this.emberHeart);
            this.player1.clickDie(0);
            this.player1.clickDone();

            this.player1.clickCard(this.iceBuff); // does nothing

            expect(this.ironWorker.upgrades.length).toBe(1);
            expect(this.emberHeart.upgrades.length).toBe(0);
        });
    });
});
