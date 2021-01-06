describe('Attack on Phoenixborn without attackers', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['mist-spirit', 'iron-worker']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['flute-mage', 'iron-worker']
            }
        });
    });

    it('should cancel without spending main action', function () {
        expect(this.player1.actions.main).toBe(true);

        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.coalRoarkwin); // target
        this.player1.clickPrompt('Done'); // end attacker choice

        expect(this.player1.actions.main).toBe(true);
        expect(this.player1).toHavePromptButton('Attack');
    });
});
