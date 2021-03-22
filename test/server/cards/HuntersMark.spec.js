describe('Hunters Mark', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'harold-westraven',
                inPlay: ['mist-spirit', 'blue-jaguar', 'anchornaut'],
                dicepool: ['divine', 'illusion', 'charm', 'charm'],
                spellboard: [],
                archives: ['hunters-mark']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['iron-worker'],
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
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.ironWorker);
        this.player1.clickCard(this.mistSpirit);
        this.player2.clickDone(); // guard
        this.player2.clickPrompt('No'); // counter

        expect(this.ironWorker.location).toBe('discard');
    });

    it('multiple upgrades - bug report', function () {
        this.player1.clickCard(this.haroldWestraven);

        this.player1.clickPrompt('Mark Prey');
        this.player1.clickCard(this.ironWorker);
        this.player1.clickCard(this.huntersMark);
        this.player1.endTurn();
        this.player2.play(this.explosiveGrowth, this.ironWorker);
        expect(this.ironWorker.upgrades.length).toBe(2);
    });

    it('multiple explosive growth not allowed', function () {
        this.player1.endTurn();
        this.player2.play(this.explosiveGrowth, this.ironWorker);
        expect(this.ironWorker.upgrades.length).toBe(1);
        this.player2.player.actions.side = true;
        this.player2.play(this.player2.hand[0], this.ironWorker);
        expect(this.ironWorker.upgrades.length).toBe(1);
        expect(this.player2.discard[0].id).toBe('explosive-growth');
    });
});
