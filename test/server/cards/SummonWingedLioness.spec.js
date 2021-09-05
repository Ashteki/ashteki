describe('Summon Winged Lioness', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                spellboard: ['summon-winged-lioness'],
                dicepool: ['divine', 'divine', 'illusion'],
                archives: ['winged-lioness']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['hammer-knight'],
                spellboard: []
            }
        });
    });

    it('should place a winged lioness into play', function () {
        this.player1.clickCard(this.summonWingedLioness);
        this.player1.clickPrompt('Summon Winged Lioness');
        this.player1.clickDie(2);
        this.player1.clickPrompt('Done');
        expect(this.wingedLioness.location).toBe('play area');
    });
});
