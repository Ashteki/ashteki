describe('Hunters Mark Ability', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'harold-westraven',
                inPlay: ['mist-spirit'],
                dicepool: ['divine', 'illusion', 'charm', 'charm'],
                spellboard: [],
                archives: ['hunters-mark']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['iron-worker', 'hammer-knight'],
                dicepool: ['natural', 'natural', 'sympathy', 'sympathy'],
                hand: ['explosive-growth', 'explosive-growth']
            }
        });
    });

    it('modifies card attack', function () {
        this.player1.clickCard(this.haroldWestraven);

        this.player1.clickPrompt('Mark Prey');
        this.player1.clickCard(this.ironWorker);
        this.player1.clickCard(this.huntersMark);
        expect(this.huntersMark.parent).toBe(this.ironWorker);

        this.player1.player.actions.side = 1;
        this.haroldWestraven.tokens.exhaustion = 0;

        expect(this.haroldWestraven.exhausted).toBe(false);
        this.player1.clickCard(this.haroldWestraven);
        this.player1.clickPrompt('Mark Prey');
        this.player1.clickCard(this.hammerKnight);
        expect(this.huntersMark.parent).toBe(this.ironWorker);
        this.player1.clickCard(this.huntersMark);
        expect(this.huntersMark.parent).toBe(this.ironWorker);

    });
});
