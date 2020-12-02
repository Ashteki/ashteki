describe('Refresh action spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['iron-worker'],
                dicepool: ['natural', 'ceremonial', 'charm', 'charm'],
                hand: ['refresh'],
                spellboard: ['chant-of-revenge']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['blue-jaguar', 'mist-spirit'],
                spellboard: []
            }
        });
        this.ironWorker.tokens.exhaustion = 2;
    });

    it('should remove all exhaustion tokens from target', function () {
        expect(this.ironWorker.exhausted).toBe(true);

        this.player1.clickCard(this.refresh);
        this.player1.clickPrompt('Play this action');
        this.player1.clickDie(0);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.ironWorker);

        expect(this.ironWorker.exhausted).toBe(false);
    });
});
