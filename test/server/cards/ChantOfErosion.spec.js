describe('Chant of Erosion', function () {
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
                spellboard: ['chant-of-erosion'],
                archives: ['eroding']
            }
        });
    });

    it('gets status token on ally destruction', function () {
        expect(this.chantOfErosion.status).toBe(0);

        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.anchornaut);
        this.player1.clickCard(this.ironWorker);
        this.player2.clickPrompt('Done'); // no guard
        this.player2.clickPrompt('No'); // no counter
        expect(this.anchornaut.location).toBe('discard');
        expect(this.chantOfErosion.status).toBe(1);
    });

    it('attaches Eroding to unit on use', function () {
        this.player1.endTurn();
        expect(this.ironWorker.attack).toBe(2);
        expect(this.ironWorker.recover).toBe(1);
        this.chantOfErosion.tokens.status = 1;
        this.player2.clickCard(this.chantOfErosion);
        this.player2.clickPrompt('Eroding');
        expect(this.player2).toBeAbleToSelect(this.ironWorker);
        expect(this.player2).toBeAbleToSelect(this.anchornaut);
        this.player2.clickCard(this.ironWorker);

        expect(this.ironWorker.upgrades.length).toBe(1);
        expect(this.ironWorker.attack).toBe(1);
        expect(this.ironWorker.recover).toBe(0);

        this.player2.endTurn();
        this.player1.endTurn();
        this.player2.endTurn();
        this.player1.clickDone();
        this.player1.clickPrompt('0');

        // end of round
        expect(this.ironWorker.damage).toBe(1);
        expect(this.eroding.location).toBe('archives');
    });
});
