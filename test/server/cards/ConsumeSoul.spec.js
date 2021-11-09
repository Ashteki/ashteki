describe('Consume Soul', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['iron-worker', 'emberoot-lizard'],
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
        this.emberootLizard.tokens.status = 1;
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

    it('does not trigger when my emberoot ping destroys its own unit', function () {
        // not attack damage so no trigger
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.anchornaut);
        this.player1.clickCard(this.emberootLizard);
        this.player1.clickCard(this.anchornaut);
        expect(this.anchornaut.location).toBe('discard');
        // battle should be stopped when anchornaut is killed
        expect(this.game.attackState).toBe(null);
        expect(this.player1).toHaveDefaultPrompt();
    });
});
