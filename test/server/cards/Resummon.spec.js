describe('Resummon', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['blue-jaguar'],
                spellboard: ['resummon'],
                dicepool: ['ceremonial', 'illusion', 'charm', 'charm']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['hammer-knight'],
                spellboard: []
            }
        });

        this.blueJaguar.tokens.damage = 1;
    });

    it('should destroy then replay a conjuration without tokens', function () {
        expect(this.blueJaguar.damage).toBe(1);

        this.player1.clickCard(this.resummon);

        this.player1.clickPrompt('Resummon');
        this.player1.clickCard(this.blueJaguar);

        expect(this.blueJaguar.location).toBe('play area');
        expect(this.blueJaguar.damage).toBe(0);
    });
});
