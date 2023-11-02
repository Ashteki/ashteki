describe('Chant of Revenge', function () {
    describe('status token acquisition', function () {

        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['iron-worker'],
                    dicepool: ['natural', 'illusion', 'charm', 'charm']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut'],
                    spellboard: ['chant-of-revenge']
                }
            });
        });

        it('gets status token on ally destruction', function () {
            expect(this.chantOfRevenge.status).toBe(0);

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.anchornaut);
            this.player1.clickCard(this.ironWorker);
            this.player2.clickPrompt('Done'); // no guard
            this.player2.clickPrompt('No'); // no counter
            expect(this.anchornaut.location).toBe('discard');
            // prompt for jessa

            expect(this.chantOfRevenge.status).toBe(1);
        });

        it('no status token if exhausted', function () {
            expect(this.chantOfRevenge.status).toBe(0);
            this.chantOfRevenge.tokens.exhaustion = 1;

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.anchornaut);
            this.player1.clickCard(this.ironWorker);
            this.player2.clickPrompt('Done'); // no guard
            this.player2.clickPrompt('No'); // no counter
            expect(this.anchornaut.location).toBe('discard');
            // prompt for jessa

            expect(this.chantOfRevenge.status).toBe(0);
        });

        it('no status token increase if already has one', function () {
            this.chantOfRevenge.tokens.status = 1;

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.anchornaut);
            this.player1.clickCard(this.ironWorker);
            this.player2.clickPrompt('Done'); // no guard
            this.player2.clickPrompt('No'); // no counter
            expect(this.anchornaut.location).toBe('discard');
            // prompt for jessa

            expect(this.chantOfRevenge.status).toBe(1);
        });
    });

    describe('action damages pb', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut'],
                    spellboard: ['chant-of-revenge']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['iron-worker'],
                    dicepool: ['natural', 'illusion', 'charm', 'charm']
                }
            });

            this.chantOfRevenge.tokens.status = 1;
        });

        it('gets status token on ally destruction', function () {
            this.player1.clickCard(this.chantOfRevenge);
            this.player1.clickPrompt('Take revenge');

            expect(this.aradelSummergaard.damage).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('action triggers vanish', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut'],
                    spellboard: ['chant-of-revenge']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['iron-worker'],
                    dicepool: ['natural', 'illusion', 'charm', 'charm'],
                    hand: ['vanish']
                }
            });

            this.chantOfRevenge.tokens.status = 1;
        });

        it('gets status token on ally destruction', function () {
            this.player1.clickCard(this.chantOfRevenge);
            this.player1.clickPrompt('Take revenge');

            expect(this.player1).not.toHaveDefaultPrompt();

            this.player2.clickCard(this.vanish);

            expect(this.aradelSummergaard.damage).toBe(0);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

});
