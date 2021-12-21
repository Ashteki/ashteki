describe('Crimson Bomber detonate ability', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'odette-diamondcrest',
                inPlay: ['crimson-bomber'],
                dicepool: ['divine', 'charm', 'divine', 'charm'],
                hand: []
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['silver-snake', 'hammer-knight', 'anchornaut', 'iron-worker'],
                spellboard: []
            }
        });
    });

    it('choose 3 units and add wound tokens', function () {
        this.player1.clickCard(this.crimsonBomber);
        this.player1.clickPrompt('Detonate 3');

        this.player1.clickCard(this.anchornaut);
        this.player1.clickCard(this.ironWorker);
        this.player1.clickCard(this.hammerKnight);
        this.player1.clickDone();

        expect(this.anchornaut.location).toBe('discard');
        expect(this.ironWorker.damage).toBe(1);
        expect(this.hammerKnight.damage).toBe(1);
    });
});
