describe('During attack on Phoenixborn', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['hammer-knight', 'iron-worker']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['anchornaut', 'mist-spirit']
            }
        });
    });

    it('side effect removal of blocker allows damage to phoenixborn', function () {
        expect(this.aradelSummergaard.damage).toBe(0); // Damage from iron worker

        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.aradelSummergaard); // target pb
        this.player1.clickCard(this.hammerKnight);
        this.player1.clickCard(this.ironWorker); // 2 attackers
        this.player1.clickPrompt('Done'); // end attacker choice

        this.player2.clickCard(this.anchornaut);
        this.player2.clickCard(this.hammerKnight);
        this.player2.clickCard(this.mistSpirit); // 2 attackers
        this.player2.clickCard(this.ironWorker); // 2 attackers
        // this.player2.clickPrompt('Done'); // blockers

        expect(this.player1).toHavePrompt('Choose a fight to resolve');
        this.player1.clickCard(this.hammerKnight);
        this.player1.clickCard(this.mistSpirit); // aftershock target

        expect(this.mistSpirit.location).toBe('archives');
        // second battle auto-resolves - defender has been removed
        expect(this.aradelSummergaard.damage).toBe(2); // Damage from iron worker
    });
});
