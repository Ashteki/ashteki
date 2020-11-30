describe('Empower focussed', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['iron-worker', 'anchornaut'],
                dicepool: ['natural', 'ceremonial', 'charm', 'charm'],
                hand: [],
                spellboard: ['empower', 'empower']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['hammer-knight', 'mist-spirit'],
                spellboard: ['summon-butterfly-monk']
            }
        });

        this.anchornaut.tokens.status = 2;
    });

    it('removes tokens from a unit', function () {
        expect(this.ironWorker.tokens.status).toBeUndefined();

        this.player1.clickCard(this.empower);
        this.player1.clickPrompt('Empower');
        this.player1.clickDie(0);
        expect(this.player1).toHavePrompt('Choose a unit to empower');
        this.player1.clickCard(this.ironWorker);

        expect(this.ironWorker.tokens.status).toBe(1);

        this.player1.clickCard(this.anchornaut);
        this.player1.clickPrompt('2');
        expect(this.player1).toHavePrompt('Choose a unit');
        this.player1.clickCard(this.hammerKnight);

        expect(this.hammerKnight.damage).toBe(2);
    });
});
