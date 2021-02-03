describe('Sleeping Bear', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'brennen-blackcloud',
                inPlay: ['flash-archer'],
                hand: ['sleeping-bear'],
                dicepool: ['natural', 'natural']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['flute-mage', 'hammer-knight', 'anchornaut']
            }
        });
    });

    it('is exhausted when enters play', function () {
        this.player1.clickCard(this.sleepingBear);
        this.player1.clickPrompt('play this ally');
        expect(this.sleepingBear.location).toBe('play area');
        expect(this.sleepingBear.exhaustion).toBe(1);
    });
});
