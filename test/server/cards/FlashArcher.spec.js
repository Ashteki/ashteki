describe('Flash Archer', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'brennen-blackcloud',
                inPlay: ['flash-archer']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['flute-mage', 'hammer-knight', 'anchornaut']
            }
        });
    });

    it('use double shot same target', function () {
        this.player1.clickCard(this.flashArcher);
        this.player1.clickPrompt('Double Shot');
        this.player1.clickCard(this.hammerKnight);
        this.player1.clickCard(this.hammerKnight);

        expect(this.flashArcher.exhaustion).toBe(1);
        expect(this.hammerKnight.damage).toBe(2);
    });

    it('use double shot different targets', function () {
        this.player1.clickCard(this.flashArcher);
        this.player1.clickPrompt('Double Shot');
        this.player1.clickCard(this.fluteMage);
        this.player1.clickCard(this.hammerKnight);

        expect(this.flashArcher.exhaustion).toBe(1);
        expect(this.fluteMage.damage).toBe(1);
    });
});
