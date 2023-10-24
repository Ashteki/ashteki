describe('Tidal crab', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'orrick-gilstream',
                inPlay: ['tidal-crab', 'anchornaut'],
                dicepool: ['sympathy', 'charm', 'charm', 'time', 'illusion'],
                spellboard: ['summon-tidal-crab'],
                deck: ['anchornaut']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                dicepool: ['natural'],
                inPlay: ['iron-worker'],
                spellboard: ['chant-of-revenge']
            }
        });
    });

    it('BUG: dont move token to other card when no tokens on existing', function () {
        expect(this.tidalCrab.status).toBe(0);
        this.player1.clickCard(this.tidalCrab);
        this.player1.clickPrompt('Unburden');

        this.player1.clickCard(this.anchornaut);
        expect(this.anchornaut.status).toBe(0);
    });
});
