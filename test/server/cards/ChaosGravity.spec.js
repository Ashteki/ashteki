describe('chaos gravity spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'odette-diamondcrest',
                inPlay: ['hammer-knight', 'iron-worker'],
                dicepool: [
                    'divine',
                    'divine',
                    'sympathy',
                    'sympathy',
                    'charm',
                    'divine',
                    'divine',
                    'sympathy',
                    'sympathy',
                    'charm'
                ],
                hand: ['chaos-gravity'],
                spellboard: ['chant-of-revenge']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['silver-snake', 'mist-spirit'],
                spellboard: []
            }
        });

        this.player1.dicepool[0].level = 'class';
        this.hammerKnight.tokens.exhaustion = 1;
    });

    it('affects multiple units', function () {
        this.player1.clickCard(this.chaosGravity);
        this.player1.clickPrompt('Play this action');
        this.player1.clickDie(2);
        this.player1.clickDie(0);
        this.player1.clickPrompt('Done');
        expect(this.player1).toHavePrompt('Choose a unit to exhaust');
        this.player1.clickCard(this.silverSnake);
        expect(this.silverSnake.exhausted).toBe(true);
        this.player1.clickCard(this.hammerKnight);
        expect(this.player1).not.toBeAbleToSelect(this.silverSnake);
        this.player1.clickCard(this.ironWorker);
        expect(this.hammerKnight.exhausted).toBe(false);
        expect(this.ironWorker.exhausted).toBe(true);
        this.player1.clickCard(this.ironWorker);
        expect(this.ironWorker.exhausted).toBe(false);
    });
});
