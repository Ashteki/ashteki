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
                inPlay: ['iron-worker', 'mist-spirit', 'anchornaut'],
                spellboard: []
            }
        });
    });

    it('removes unit from play then returns at end of turn', function () {
        expect(this.ironWorker.damage).toBe(0);

        this.player1.play(this.blink);
        this.player1.clickDie(0);
        this.player1.clickCard(this.ironWorker);

        expect(this.ironWorker.location).toBe('purged');

        this.player1.endTurn();
        expect(this.ironWorker.location).toBe('play area');
    });

    it('should allow enters play triggers', function () {
        this.player1.play(this.blink);
        this.player1.clickDie(0);
        this.player1.clickCard(this.anchornaut);

        expect(this.anchornaut.location).toBe('purged');

        this.player1.endTurn();
        expect(this.anchornaut.location).toBe('play area');
        // enters play reaction
        expect(this.player2).toHavePrompt('Throw 1');
    });
});
