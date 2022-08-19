describe('Rowan Umberend', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['iron-worker'],
                dicepool: ['natural', 'illusion', 'charm', 'charm']
            },
            player2: {
                phoenixborn: 'rowan-umberend',
                inPlay: ['anchornaut'],
                dicepool: ['ceremonial']
            }
        });
    });

    it('conscript on ally destruction, then exhume on turn', function () {
        expect(this.rowanUmberend.childCards.length).toBe(0);
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.anchornaut);
        this.player1.clickCard(this.ironWorker);
        this.player2.clickPrompt('Done'); // no guard
        this.player2.clickPrompt('No'); // no counter
        expect(this.anchornaut.location).toBe('discard');
        expect(this.player2).toBeAbleToSelect(this.rowanUmberend);
        this.player2.clickCard(this.rowanUmberend);
        expect(this.rowanUmberend.childCards.length).toBe(1);
        this.player1.endTurn();
        this.player2.clickCard(this.rowanUmberend);
        this.player2.clickPrompt('Exhume');
        this.player2.clickDie(0);
        // anchornaut enter play effect
        this.player2.clickCard(this.ironWorker);
        expect(this.ironWorker.damage).toBe(1);
        // then destroy anchornaut
        expect(this.anchornaut.location).toBe('discard');
    });
});
