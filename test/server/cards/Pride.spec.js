describe('Pride', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['iron-worker', 'flute-mage'],
                dicepool: ['charm', 'charm', 'divine'],
                hand: ['reflections-in-the-water', 'pride']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['hammer-knight', 'gilder'],
                spellboard: []
            }
        });
    });

    it('unit cannot be guarded against', function () {
        this.player1.play(this.pride);
        this.player1.clickCard(this.fluteMage);
        this.player1.clickDone(); // no smuggle

        this.player1.clickAttack(this.hammerKnight);
        this.player1.clickCard(this.fluteMage);

        // no guard prompt
        this.player2.clickNo(); // counter

        expect(this.hammerKnight.damage).toBe(1);
        this.player1.endTurn();
    });

    it('unit cannot be guarded', function () {
        this.player1.play(this.pride);
        this.player1.clickCard(this.fluteMage);
        this.player1.clickDie(2); // smuggle
        this.player1.clickCard(this.fluteMage);
        expect(this.fluteMage.attack).toBe(2);

        this.player1.endTurn();
        this.player2.clickAttack(this.fluteMage);
        this.player2.clickCard(this.hammerKnight);

        // no guard prompt
        this.player1.clickYes(); // counter

        this.player2.clickDone(); // aftershock
        expect(this.hammerKnight.damage).toBe(2);
        expect(this.fluteMage.location).toBe('discard');
    });
});
