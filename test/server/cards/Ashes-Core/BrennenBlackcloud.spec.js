describe('Brennen Blackcloud Ability', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'brennen-blackcloud',
                inPlay: ['iron-worker'],
                dicepool: ['natural', 'ceremonial', 'charm', 'charm'],
                hand: []
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['mist-spirit'],
                spellboard: []
            }
        });
        this.ironWorker.tokens.status = 2;
    });

    it('should destroy my unit, and deal damage to chosen pb', function () {
        expect(this.aradelSummergaard.damage).toBe(0);

        this.player1.clickCard(this.brennenBlackcloud);
        this.player1.clickPrompt('Spirit Burn');
        this.player1.clickCard(this.ironWorker); // destroy my unit
        this.player1.clickCard(this.aradelSummergaard); // 2 damage to pb

        expect(this.ironWorker.location).toBe('discard');
        expect(this.aradelSummergaard.damage).toBe(2);
    });

    it('can affect own pb', function () {
        expect(this.brennenBlackcloud.damage).toBe(0);

        this.player1.clickCard(this.brennenBlackcloud);
        this.player1.clickPrompt('Spirit Burn');
        this.player1.clickCard(this.ironWorker); // destroy my unit
        this.player1.clickCard(this.brennenBlackcloud); // 2 damage to pb

        expect(this.ironWorker.location).toBe('discard');
        expect(this.brennenBlackcloud.damage).toBe(2);
    });
});
