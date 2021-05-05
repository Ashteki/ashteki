describe('Blink action spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['mist-spirit'],
                dicepool: ['natural', 'ceremonial', 'illusion', 'charm'],
                hand: ['blink']
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

        this.player1.play(this.blink);
        // this.player1.clickCard(this.ironWorker);
        this.player1.clickDie(0);
        this.player1.clickCard(this.ironWorker);

        expect(this.ironWorker.location).toBe('purged');

        this.player1.endTurn();
        expect(this.ironWorker.location).toBe('play area');
    });
});
