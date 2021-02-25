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
                spellboard: ['empower', 'summon-mist-spirit']
            }
        });
        this.ironWorker.tokens.status = 2;
        this.ironWorker.tokens.exhaustion = 1;
        this.chantOfRevenge.tokens.exhaustion = 1;
        this.summonMistSpirit.tokens.exhaustion = 1;
    });

    it('should move 1 chosen token type between cards', function () {
        expect(this.ironWorker.tokens.status).toBe(2);
        expect(this.chantOfRevenge.tokens.status).toBeUndefined();

        this.player1.clickCard(this.transfer);
        this.player1.clickPrompt('Play this action');
        this.player1.clickDie(0);
        this.player1.clickPrompt('Done');
        expect(this.player1).toBeAbleToSelect(this.chantOfRevenge); // mine
        expect(this.player1).toBeAbleToSelect(this.summonMistSpirit); // other player
        expect(this.player1).not.toBeAbleToSelect(this.empower); // no tokens
        expect(this.player1).toHavePrompt('Choose a card with tokens');

        this.player1.clickCard(this.ironWorker);
        expect(this.player1).toHavePrompt('Choose a type');
        expect(this.player1).toHavePromptButton('Exhaustion');
        expect(this.player1).toHavePromptButton('Status');

        this.player1.clickPrompt('Status');
        expect(this.player1).not.toBeAbleToSelect(this.empower); // needs same player controlling target
        expect(this.player1).toHavePrompt('Choose a card to receive the token');

        this.player1.clickCard(this.chantOfRevenge);
        expect(this.ironWorker.tokens.status).toBe(1);
        expect(this.chantOfRevenge.tokens.status).toBe(1);
    });
});
