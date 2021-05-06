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
                    hand: ['rins-fury'],
                    dicepool: ['natural', 'natural']
                }
            });
        });

        it('reduces attack of units in battle', function () {
            this.player1.clickCard(this.lawOfFear);

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.hammerKnight); // target
            this.player1.clickCard(this.ironWorker); // single attacker

            expect(this.hammerKnight.attack).toBe(3);
            expect(this.ironWorker.attack).toBe(1);
            expect(this.mistSpirit.attack).toBe(1);
        });
    });
});
