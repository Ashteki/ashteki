describe('Dodge reaction spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'issa-brightmore',
                inPlay: ['flute-mage'],
                dicepool: ['artifice', 'artifice', 'natural'],
                hand: ['barrier'],
                deck: ['molten-gold']
            },
            player2: {
                phoenixborn: 'arren-frostpeak',
                inPlay: ['blue-jaguar', 'mist-spirit', 'iron-worker'],
                dicepool: ['natural', 'astral'],
                hand: ['dodge']
            }
        });
    });

    it('on Attack smuggle one die and then prevent astral exhaustion on damage prevention', function () {
        expect(this.player1.player.effects.length).toBe(0);
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.blueJaguar);
        this.player1.clickCard(this.fluteMage);
        // on attackers declared
        this.player2.clickCard(this.dodge);
        this.player2.clickCard(this.blueJaguar);
        expect(this.blueJaguar.isAirborne).toBe(true);
        this.player2.clickDone();
        this.player2.clickYes();

        expect(this.dodge.location).toBe('discard');
        expect(this.blueJaguar.damage).toBe(0);
        expect(this.fluteMage.damage).toBe(1);
        expect(this.blueJaguar.isAirborne).toBe(true);
        expect(this.player1).toHaveDefaultPrompt();
        this.player1.endTurn();
        expect(this.player1.player.effects.length).toBe(0);
    });
});
