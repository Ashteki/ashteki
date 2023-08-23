describe('Red Flower refresh', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['iron-worker', 'anchornaut', 'hammer-knight'],
                dicepool: ['natural', 'natural', 'natural', 'ceremonial', 'charm', 'charm'],
                hand: ['red-flower', 'root-armor'],
                spellboard: ['chant-of-revenge']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['blue-jaguar', 'mist-spirit', 'blood-archer'],
                spellboard: []
            }
        });
        this.ironWorker.tokens.status = 1;
        this.ironWorker.tokens.exhaustion = 1;
        this.hammerKnight.tokens.exhaustion = 2;
        this.hammerKnight.tokens.damage = 2;
    });

    it('remove 2 tokens from unit with 1 status', function () {
        expect(this.ironWorker.exhausted).toBe(true);

        this.player1.play(this.redFlower);
        this.player1.clickDie(3);
        this.player1.clickPrompt('Done');
        expect(this.player1).not.toBeAbleToSelect(this.anchornaut);
        expect(this.player1).not.toBeAbleToSelect(this.hammerKnight);
        this.player1.clickCard(this.ironWorker);

        expect(this.ironWorker.exhausted).toBe(false);
        expect(this.ironWorker.status).toBe(0);

        expect(this.player1).toHaveDefaultPrompt();
    });

    it('remove over 3 tokens from unit with attachment', function () {
        expect(this.hammerKnight.exhausted).toBe(true);

        this.player1.play(this.rootArmor, this.hammerKnight);
        expect(this.hammerKnight.upgrades.length).toBe(1);

        this.player1.play(this.redFlower);
        this.player1.clickDie(3);
        this.player1.clickPrompt('Done');
        expect(this.player1).not.toBeAbleToSelect(this.anchornaut);
        this.player1.clickCard(this.hammerKnight);

        expect(this.hammerKnight.exhausted).toBe(false);
        expect(this.hammerKnight.damage).toBe(0);

        this.player1.clickCard(this.bloodArcher);

        expect(this.bloodArcher.damage).toBe(1);
    });
});
