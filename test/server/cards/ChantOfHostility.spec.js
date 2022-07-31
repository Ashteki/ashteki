describe('Chant of Hostility', function () {
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
                spellboard: ['chant-of-hostility']
            }
        });
    });

    it('gets status token on ally destruction', function () {
        expect(this.chantOfHostility.status).toBe(0);

        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.anchornaut);
        this.player1.clickCard(this.ironWorker);
        this.player2.clickPrompt('Done'); // no guard
        this.player2.clickPrompt('No'); // no counter
        expect(this.anchornaut.location).toBe('discard');
        expect(this.chantOfHostility.status).toBe(1);
    });

    it('gives plus 1 attack on use', function () {
        this.player1.endTurn();
        expect(this.anchornaut.attack).toBe(0);
        this.chantOfHostility.tokens.status = 1;
        this.player2.clickCard(this.chantOfHostility);
        this.player2.clickPrompt('Hostility');
        this.player2.clickCard(this.anchornaut);
        expect(this.anchornaut.attack).toBe(1);
    });
});
