describe('Summon Emperor Lion', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                spellboard: ['summon-emperor-lion'],
                dicepool: ['divine', 'divine', 'illusion'],
                archives: ['emperor-lion']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['hammer-knight'],
                spellboard: []
            }
        });
    });

    it('should place a winged lioness into play', function () {
        this.player1.clickCard(this.summonEmperorLion);
        this.player1.clickPrompt('Summon Emperor Lion');
        this.player1.clickDie(2);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.player1.archives[0]);
        expect(this.player1).toHaveDefaultPrompt();
        expect(this.emperorLion.location).toBe('play area');
    });
});
