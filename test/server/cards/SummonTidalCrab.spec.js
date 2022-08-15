describe('Summon Tidal crab', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'orrick-gilstream',
                inPlay: ['hammer-knight', 'anchornaut'],
                dicepool: ['sympathy', 'charm', 'charm', 'time', 'illusion'],
                spellboard: ['summon-tidal-crab'],
                archives: ['tidal-crab'],
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

    it('normal summon plus unburden ability', function () {
        this.player1.clickCard(this.summonTidalCrab);
        this.player1.clickPrompt('Summon Tidal Crab');

        expect(this.tidalCrab.location).toBe('play area');
        expect(this.tidalCrab.status).toBe(2);
        expect(this.tidalCrab.attack).toBe(0);

        this.player1.clickCard(this.tidalCrab);
        this.player1.clickPrompt('Unburden');
        this.player1.clickCard(this.anchornaut);

        expect(this.tidalCrab.status).toBe(1);
        expect(this.tidalCrab.attack).toBe(1);
        expect(this.anchornaut.status).toBe(1);
    });
});
