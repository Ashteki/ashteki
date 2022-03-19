describe('Survival of the Fittest', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'lulu-firststone',
                inPlay: ['hammer-knight', 'iron-worker'],
                spellboard: [],
                dicepool: ['natural', 'natural', 'time', 'charm'],
                hand: ['survival-of-the-fittest'],
                archives: ['spark']
            },
            player2: {
                phoenixborn: 'saria-guideman',
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                hand: ['sympathy-pain'],
                inPlay: ['flute-mage', 'anchornaut', 'silver-snake']
            }
        });

        this.silverSnake.tokens.status = 2;
        this.anchornaut.tokens.exhaustion = 1;
        this.hammerKnight.tokens.damage = 1;
    });

    it('destroys all but token or alteration units', function () {
        this.player1.clickCard(this.luluFirststone);
        this.player1.clickPrompt('Bolster');
        this.player1.clickDie(0);
        this.player1.clickCard(this.ironWorker);
        this.player1.actions.main = false;
        this.player1.endTurn();
        this.player2.endTurn();

        this.player1.play(this.survivalOfTheFittest);
        this.player1.clickDie(3);
        this.player1.clickDone();
        this.player1.clickCard(this.fluteMage);
        expect(this.player1).toHaveDefaultPrompt();

        // tokens
        expect(this.hammerKnight.location).toBe('play area');
        expect(this.anchornaut.location).toBe('play area');
        expect(this.silverSnake.location).toBe('play area');
        // alteration
        expect(this.ironWorker.location).toBe('play area');
        // vanilla
        expect(this.fluteMage.location).toBe('discard');
    });
});
