describe('law of Grace', function () {
    describe('law of grace in hand', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['mist-spirit', 'iron-worker'],
                    dicepool: ['divine', 'divine', 'charm', 'charm', 'natural', 'natural'],
                    hand: ['law-of-grace', 'freezing-blast']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['hammer-knight'],
                    spellboard: [],
                    hand: ['rins-fury'],
                    dicepool: ['natural', 'natural']
                }
            });

            this.coalRoarkwin.tokens.damage = 1;
        });

        it('heal 1 pb wound when played', function () {
            expect(this.coalRoarkwin.damage).toBe(1);
            this.player1.clickCard(this.lawOfGrace);
            this.player1.clickPrompt('Play this ready spell');
            expect(this.coalRoarkwin.damage).toBe(0);
        });
    });

    describe('law of grace in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['mist-spirit', 'iron-worker'],
                    dicepool: ['divine', 'divine', 'charm', 'charm', 'natural', 'natural'],
                    spellboard: ['law-of-grace', 'summon-gilder']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['hammer-knight'],
                    dicepool: ['natural', 'natural']
                }
            });
        });

        it('cannot be meditated from spellboard', function () {
            this.player1.clickPrompt('Meditate');
            expect(this.player1).not.toBeAbleToSelect(this.lawOfGrace);
            expect(this.player1).toBeAbleToSelect(this.summonGilder);
        });

        it('reduces pb damage by 1', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.rinNorthfell);
            this.player1.clickCard(this.ironWorker);
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Done');
            expect(this.rinNorthfell.damage).toBe(1); // 2 damage -1 from law of grace
        });

        it('does not reduce unit damage', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.ironWorker);
            this.player2.clickPrompt('Done');
            this.player2.clickPrompt('No');
            expect(this.hammerKnight.damage).toBe(2);
        });
    });
});
