describe('Empower', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['iron-worker'],
                dicepool: ['natural', 'ceremonial', 'charm', 'charm'],
                hand: [],
                spellboard: ['empower']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['blue-jaguar', 'mist-spirit'],
                spellboard: ['summon-butterfly-monk']
            }
        });
    });

    it('adds a token to one unit', function () {
        expect(this.ironWorker.tokens.status).toBeUndefined();

        this.player1.clickCard(this.empower);
        this.player1.clickPrompt('Empower');
        this.player1.clickDie(0);
        expect(this.player1).toHavePrompt('Choose a unit to empower');
        this.player1.clickCard(this.ironWorker);

        expect(this.ironWorker.tokens.status).toBe(1);
        expect(this.player1).toHavePrompt('Choose a card to play or use');
    });
});
