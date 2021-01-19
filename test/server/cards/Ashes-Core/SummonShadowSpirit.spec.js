describe('Summon Shadow Spirit', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                spellboard: ['summon-shadow-spirit'],
                dicepool: ['illusion'],
                archives: ['shadow-spirit']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['hammer-knight'],
                spellboard: []
            }
        });
    });

    it('should place a shadow spirit into play', function () {
        this.player1.clickCard(this.summonShadowSpirit);
        this.player1.clickPrompt('Summon Shadow Spirit');
        this.player1.clickCard(this.player1.archives[0]);
        expect(this.player1).toHaveDefaultPrompt();
        expect(this.shadowSpirit.location).toBe('play area');
    });
});
