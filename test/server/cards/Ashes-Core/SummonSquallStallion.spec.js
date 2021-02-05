describe('Summon Squall Stallion', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                spellboard: ['summon-squall-stallion'],
                dicepool: ['illusion', 'sympathy'],
                archives: ['squall-stallion']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['hammer-knight'],
                spellboard: []
            }
        });
    });

    it('should place a shadow spirit into play', function () {
        this.player1.clickCard(this.summonSquallStallion);
        this.player1.clickPrompt('Summon Squall Stallion');
        this.player1.clickDie(0);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.player1.archives[0]);
        expect(this.player1).toHaveDefaultPrompt();
        expect(this.squallStallion.location).toBe('play area');

        expect(this.player1.hand.length).toBe(1);
    });
});
