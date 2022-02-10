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
                inPlay: ['silver-snake', 'mist-spirit', 'shadow-hound'],
                spellboard: []
            }
        });

        this.player1.dicepool[0].level = 'class';
        this.hammerKnight.tokens.exhaustion = 1;
        this.mistSpirit.tokens.exhaustion = 1;
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
        // target token source
        this.player1.clickCard(this.hammerKnight);
        expect(this.player1).not.toBeAbleToSelect(this.silverSnake);
        // non-targetted token placed
        this.player1.clickCard(this.ironWorker);
        expect(this.hammerKnight.exhausted).toBe(false);
        expect(this.ironWorker.exhausted).toBe(true);
        // remove exhaust token from target unit
        this.player1.clickCard(this.ironWorker);
        expect(this.ironWorker.exhausted).toBe(false);
    });

    it('can transfer to concealed units', function () {
        this.ironWorker.tokens.exhaustion = 1;

        this.player1.clickCard(this.chaosGravity);
        this.player1.clickPrompt('Play this action');
        this.player1.clickDie(2);
        this.player1.clickDie(0);
        this.player1.clickPrompt('Done');
        expect(this.player1).toHavePrompt('Choose a unit to exhaust');
        this.player1.clickCard(this.silverSnake);
        expect(this.silverSnake.exhausted).toBe(true);
        // target token source
        this.player1.clickCard(this.mistSpirit);
        // non-targetted token placed
        this.player1.clickCard(this.shadowHound);
        expect(this.mistSpirit.exhausted).toBe(false);
        expect(this.shadowHound.exhausted).toBe(true);

        // remove exhaust token from target unit
        this.player1.clickCard(this.ironWorker);
        expect(this.ironWorker.exhausted).toBe(false);
    });
});
