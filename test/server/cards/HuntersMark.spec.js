describe('Hunters Mark', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'harold-westraven',
                inPlay: ['mist-spirit', 'battle-seer', 'anchornaut'],
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
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.ironWorker);
        this.player1.clickCard(this.mistSpirit);
        // no guard prompt because of HM
        this.player2.clickPrompt('No'); // counter

        expect(this.ironWorker.location).toBe('discard');
        expect(this.mistSpirit.location).toBe('play area');
        expect(this.mistSpirit.damage).toBe(0);
    });

    it('no guarding when targetted', function () {
        this.player1.clickCard(this.haroldWestraven);
        this.player1.clickPrompt('Mark Prey');
        this.player1.clickCard(this.ironWorker);
        this.player1.clickCard(this.huntersMark);
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.ironWorker);
        this.player1.clickCard(this.mistSpirit);
        expect(this.player2).not.toHavePrompt('Choose a guard?');
        // this.player2.clickDone(); // guard
        expect(this.player2).toHavePrompt('Do you want to counter?');
        this.player2.clickPrompt('No'); // counter

        expect(this.ironWorker.location).toBe('discard');
    });

    it('quick strike interaction', function () {
        this.player1.clickCard(this.haroldWestraven);

        this.player1.clickPrompt('Mark Prey');
        this.player1.clickCard(this.hammerKnight);
        this.player1.clickCard(this.huntersMark);
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.hammerKnight);
        this.player1.clickCard(this.battleSeer);
        // no guard prompt because of HM
        this.player2.clickPrompt('Yes'); // counter

        expect(this.hammerKnight.location).toBe('discard');
        expect(this.battleSeer.location).toBe('play area');
        expect(this.battleSeer.damage).toBe(0);
    });

});
