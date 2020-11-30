describe('Small sacrifice focus', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['iron-worker'],
                dicepool: ['ceremonial', 'charm', 'charm'],
                hand: [],
                spellboard: ['small-sacrifice', 'small-sacrifice']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['blue-jaguar', 'mist-spirit'],
                spellboard: ['summon-butterfly-monk']
            }
        });
    });

    it('should give damage option when focused', function () {
        expect(this.ironWorker.tokens.damage).toBeUndefined();
        expect(this.blueJaguar.tokens.damage).toBeUndefined();

        this.player1.clickCard(this.smallSacrifice);
        this.player1.clickPrompt('Small Sacrifice');
        this.player1.clickCard(this.ironWorker); // my unit
        this.player1.clickCard(this.blueJaguar); // target
        // should be prompted for choice of token
        expect(this.player1.player.promptState.buttons.length).toBe(2);

        this.player1.clickPrompt('Damage');

        expect(this.ironWorker.tokens.damage).toBe(1);
        expect(this.blueJaguar.tokens.damage).toBe(1);
    });

    it('should give exhaust option when focused', function () {
        expect(this.ironWorker.exhausted).toBe(false);
        expect(this.blueJaguar.exhausted).toBe(false);

        this.player1.clickCard(this.smallSacrifice);
        this.player1.clickPrompt('Small Sacrifice');
        this.player1.clickCard(this.ironWorker); // my unit
        this.player1.clickCard(this.blueJaguar); // target
        // should be prompted for choice of token
        expect(this.player1.player.promptState.buttons.length).toBe(2);

        this.player1.clickPrompt('Exhaust');

        expect(this.ironWorker.exhausted).toBe(true);
        expect(this.blueJaguar.exhausted).toBe(true);
    });
});
