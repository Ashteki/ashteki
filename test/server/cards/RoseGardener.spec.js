describe('Rose Gardener', function () {
    describe('Prune 1', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['rose-gardener']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar'],
                    spellboard: ['chant-of-revenge']
                }
            });
        });

        it('should remove 1 status from a target unit', function () {
            this.blueJaguar.tokens.status = 2;
            this.chantOfRevenge.tokens.status = 1;

            this.player1.clickCard(this.roseGardener);
            this.player1.clickPrompt('Play this Ally');
            this.player1.clickDie(2);
            expect(this.player1).toBeAbleToSelect(this.chantOfRevenge);
            expect(this.player1).toBeAbleToSelect(this.blueJaguar);

            this.player1.clickCard(this.chantOfRevenge);

            expect(this.blueJaguar.status).toBe(2);
            expect(this.chantOfRevenge.status).toBe(0);
        });
    });

    describe('Cultivate 1', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight', 'rose-gardener'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: []
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar'],
                    spellboard: ['chant-of-revenge']
                }
            });

            this.player1.dicepool[2].level = 'basic';
            this.player1.dicepool[3].level = 'basic';
        });

        it('set an active die to the side you want', function () {
            expect(this.player1.dicepool[2].level).toBe('basic');
            this.player1.clickCard(this.roseGardener);
            this.player1.clickPrompt('Cultivate');

            this.player1.clickDie(2);
            this.player1.clickDone();
            expect(this.player1.dicepool[2].level).toBe('power');
        });
    });
});
