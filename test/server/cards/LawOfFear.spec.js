describe('law of fear', function () {
    describe('law of fear in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['mist-spirit', 'iron-worker'],
                    spellboard: ['law-of-fear'],
                    dicepool: ['divine', 'divine', 'charm', 'charm', 'natural', 'natural'],
                    hand: ['freezing-blast']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['hammer-knight'],
                    spellboard: [],
                    dicepool: ['natural', 'natural']
                }
            });
        });

        it('reduces attack of attacking units in battle', function () {
            this.player1.clickCard(this.lawOfFear);

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.hammerKnight); // target
            this.player1.clickCard(this.ironWorker); // single attacker

            expect(this.hammerKnight.attack).toBe(3); // not changed
            expect(this.ironWorker.attack).toBe(1); // reduced
            expect(this.mistSpirit.attack).toBe(1); // not changed

            this.player2.clickDone();
            this.player2.clickYes();

            expect(this.ironWorker.location).toBe('discard');
        });
    });
});
