describe('Rising Tides', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: [],
                dicepool: ['ceremonial', 'natural', 'charm', 'time'],
                hand: ['rising-tides', 'iron-worker']
            },
            player2: {
                phoenixborn: 'rin-northfell',
                inPlay: ['hammer-knight'],
                dicepool: ['natural', 'natural']
            }
        });
    });

    it('play to trigger at the end of next turn this round', function () {
        this.player1.play(this.risingTides);

        this.player1.play(this.ironWorker);
        this.player1.clickDie(0);
        this.player1.clickDie(1);
        this.player1.clickDone();
        this.player1.endTurn();
        this.player2.endTurn(); // end of turn this round
        this.player1.clickCard(this.ironWorker);
        this.player1.clickCard(this.hammerKnight);
        expect(this.ironWorker.damage).toBe(1);
        expect(this.hammerKnight.damage).toBe(1);
    });

    it('play and pass gives opponent chance to avoid damage', function () {
        this.player1.play(this.risingTides);
        this.player1.endTurn();
        this.player2.endTurn(); // end of round before triggers
        this.player1.clickCard(this.hammerKnight);
        expect(this.risingTides.location).toBe('discard');
        expect(this.hammerKnight.damage).toBe(0);
        this.player1.clickDone(); // dice to keep
        this.player2.clickDone();
        this.player1.clickNo(); // no discard
        this.player2.endTurn(); // no discard
        expect(this.hammerKnight.damage).toBe(0);
    });
});
