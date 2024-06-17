describe('Fork Lightning', function () {
    describe('When 2 targets present', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['iron-worker', 'flute-mage'],
                    dicepool: ['charm', 'charm', 'divine'],
                    hand: ['fork-lightning', 'pride']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight', 'gilder'],
                    spellboard: []
                }
            });
        });

        it('2 units receive 1 damage', function () {
            this.player1.play(this.forkLightning);
            this.player1.clickCard(this.gilder);
            expect(this.player1).not.toBeAbleToSelect(this.fluteMage);
            this.player1.clickCard(this.hammerKnight);
            // AoE
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.gilder);

            expect(this.hammerKnight.damage).toBe(1);
            expect(this.gilder.damage).toBe(1);
        });

        it('2 separate units required', function () {
            this.player1.play(this.forkLightning);
            this.player1.clickCard(this.gilder);
            expect(this.player1).not.toBeAbleToSelect(this.fluteMage);
            expect(this.player1).not.toBeAbleToSelect(this.gilder);
            this.player1.clickCard(this.hammerKnight);
            // AoE
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.gilder);


            expect(this.hammerKnight.damage).toBe(1);
            expect(this.gilder.damage).toBe(1);
        });

        it('can skip at first choice to waste action', function () {
            this.player1.play(this.forkLightning);
            this.player1.clickDone();

            expect(this.hammerKnight.damage).toBe(0);
            expect(this.gilder.damage).toBe(0);
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('can skip second choice to waste action', function () {
            this.player1.play(this.forkLightning);
            this.player1.clickCard(this.gilder);
            this.player1.clickDone();

            expect(this.hammerKnight.damage).toBe(0);
            expect(this.gilder.damage).toBe(0);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
    describe('When only 1 target present', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['iron-worker'],
                    dicepool: ['charm', 'charm', 'divine'],
                    hand: ['fork-lightning', 'pride']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['gilder'],
                    spellboard: []
                }
            });
        });

        it('no damage dealt', function () {
            this.player1.play(this.forkLightning);
            this.player1.clickCard(this.gilder);
            expect(this.player1).not.toBeAbleToSelect(this.ironWorker);

            expect(this.gilder.damage).toBe(0);
            expect(this.forkLightning.location).toBe('discard');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
