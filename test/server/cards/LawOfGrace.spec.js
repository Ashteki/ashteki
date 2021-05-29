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
                    dicepool: ['divine', 'divine', 'charm', 'ceremonial', 'natural', 'natural'],
                    spellboard: ['law-of-grace', 'summon-gilder'],
                    hand: ['choke']
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

        it('reduces direct pb damage by 1', function () {
            this.player1.play(this.choke);
            this.player1.clickCard(this.rinNorthfell);
            expect(this.rinNorthfell.damage).toBe(0); // 1 damage -1 from law of grace
        });

        it('does not reduce pb damage from attacks', function () {
            this.player1.clickAttack(this.rinNorthfell);
            this.player1.clickCard(this.ironWorker);
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Done');
            this.player1.clickCard(this.ironWorker);
            expect(this.rinNorthfell.damage).toBe(2);
        });

        it('does not reduce unit damage', function () {
            this.player1.clickAttack(this.hammerKnight);
            this.player1.clickCard(this.ironWorker);
            this.player2.clickPrompt('Done');
            this.player2.clickPrompt('No');
            expect(this.hammerKnight.damage).toBe(2);
        });
    });
});
