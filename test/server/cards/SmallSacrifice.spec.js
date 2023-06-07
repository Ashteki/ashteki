describe('Small sacrifice', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['iron-worker'],
                dicepool: ['natural', 'ceremonial', 'charm', 'charm'],
                hand: [],
                spellboard: ['small-sacrifice']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['blue-jaguar', 'mist-spirit'],
                spellboard: ['summon-butterfly-monk']
            }
        });
    });

    it('should deal 1 damage to both chosen targets', function () {
        expect(this.ironWorker.damage).toBe(0);
        expect(this.blueJaguar.damage).toBe(0);

        this.player1.clickCard(this.smallSacrifice);
        this.player1.clickPrompt('Small Sacrifice');
        this.player1.clickCard(this.ironWorker);
        this.player1.clickCard(this.blueJaguar);

        expect(this.ironWorker.damage).toBe(1);
        expect(this.blueJaguar.damage).toBe(1);
    });

    it('can skip second target', function () {
        expect(this.ironWorker.damage).toBe(0);
        expect(this.blueJaguar.damage).toBe(0);

        this.player1.clickCard(this.smallSacrifice);
        this.player1.clickPrompt('Small Sacrifice');
        this.player1.clickCard(this.ironWorker);
        this.player1.clickDone();

        expect(this.ironWorker.damage).toBe(1);
        expect(this.blueJaguar.damage).toBe(0);
        expect(this.player1).toHaveDefaultPrompt();
    });
});
