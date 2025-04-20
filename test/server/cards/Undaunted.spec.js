describe('Undaunted', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['iron-worker', 'flute-mage'],
                dicepool: ['charm', 'charm', 'sympathy'],
                hand: ['reflections-in-the-water', 'undaunted'],
                discard: ['abundance', 'frost-fang']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['hammer-knight', 'gilder'],
                spellboard: []
            }
        });
    });

    it('unexhaust host on attach', function () {
        this.fluteMage.exhaust();
        expect(this.fluteMage.exhausted).toBe(true);
        this.player1.play(this.undaunted);
        this.player1.clickDie(0);
        this.player1.clickDone();
        this.player1.clickCard(this.fluteMage);

        expect(this.fluteMage.attack).toBe(2);
        expect(this.fluteMage.life).toBe(3);
        expect(this.fluteMage.recover).toBe(2);
        expect(this.fluteMage.exhausted).toBe(false);
        this.player1.endTurn();
    });
});
