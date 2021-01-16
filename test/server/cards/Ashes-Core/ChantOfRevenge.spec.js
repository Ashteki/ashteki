describe('Chant of Revenge', function () {
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
