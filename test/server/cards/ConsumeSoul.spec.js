describe('Consume Soul', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['iron-worker'],
                dicepool: ['natural', 'illusion', 'charm', 'charm'],
                spellboard: [],
                hand: ['consume-soul']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['anchornaut'],
                spellboard: [],
                dicepool: ['natural', 'illusion', 'ceremonial', 'ceremonial'],
                hand: []
            }
        });

        this.aradelSummergaard.tokens.damage = 2;
        this.aradelSummergaard.tokens.exhaustion = 1;
    });

    it('played when my attack destroys an opponents unit', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.anchornaut);
        this.player1.clickCard(this.ironWorker);
        this.player2.clickPrompt('Done'); // no guard
        this.player2.clickPrompt('No'); // no counter

        expect(this.anchornaut.location).toBe('discard');

        expect(this.player1).toBeAbleToSelect(this.consumeSoul);
        this.player1.clickCard(this.consumeSoul);
        this.player1.clickDie(0);

        expect(this.aradelSummergaard.damage).toBe(0);
        expect(this.aradelSummergaard.exhausted).toBe(false);
    });
});
