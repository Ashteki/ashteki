describe('Shadow Spirit', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['shadow-spirit']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                dicepool: ['natural']
            }
        });
    });

    it('should place a shadow spirit into play', function () {
        expect(this.player2.dicepool[0].level).toBe('power');
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.coalRoarkwin);
        this.player1.clickCard(this.shadowSpirit);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.shadowSpirit);
        this.player1.clickOpponentDie(0);
        expect(this.player2.dicepool[0].level).toBe('class');
    });
});
