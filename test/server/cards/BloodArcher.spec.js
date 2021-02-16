describe('Blood Archer', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'brennen-blackcloud',
                inPlay: ['blood-archer']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['flute-mage', 'hammer-knight', 'anchornaut']
            }
        });
    });

    it('use blood shot', function () {
        this.player1.clickCard(this.bloodArcher);
        this.player1.clickPrompt('Blood Shot');
        this.player1.clickCard(this.fluteMage);

        expect(this.bloodArcher.damage).toBe(1);
        expect(this.bloodArcher.exhaustion).toBe(0);
        expect(this.fluteMage.damage).toBe(1);
    });
});
