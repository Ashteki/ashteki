describe('out of the mist action spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['mist-spirit'],
                dicepool: ['natural', 'ceremonial', 'illusion', 'charm'],
                hand: ['out-of-the-mist']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['iron-worker', 'mist-spirit'],
                spellboard: []
            }
        });
    });

    it('should deal damage and give optional draw', function () {
        expect(this.ironWorker.damage).toBe(0);

        this.player1.clickCard(this.outOfTheMist);
        this.player1.clickPrompt('Play this action');
        this.player1.clickCard(this.ironWorker);

        expect(this.ironWorker.damage).toBe(1);

        this.player1.clickPrompt('Yes');
        expect(this.player1.hand.length).toBe(1);
    });
});
