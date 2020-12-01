describe('Transfer actions spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['iron-worker'],
                dicepool: ['natural', 'ceremonial', 'charm', 'charm'],
                hand: ['transfer'],
                spellboard: ['chant-of-revenge']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['blue-jaguar', 'mist-spirit'],
                spellboard: []
            }
        });
        this.ironWorker.tokens.status = 2;
    });

    it('should move 1 chosen token type between cards', function () {
        expect(this.ironWorker.tokens.status).toBe(2);
        expect(this.chantOfRevenge.tokens.status).toBeUndefined();

        this.player1.clickCard(this.transfer);
        this.player1.clickPrompt('Play this action');
        this.player1.clickDie(0);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.ironWorker);
        this.player1.clickPrompt('Status');
        this.player1.clickCard(this.chantOfRevenge);

        expect(this.ironWorker.tokens.status).toBe(1);
        expect(this.chantOfRevenge.tokens.status).toBe(1);
    });
});
