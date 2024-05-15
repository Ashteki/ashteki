describe('Seeds of Aggression', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['iron-worker', 'flute-mage'],
                dicepool: ['charm', 'charm', 'divine'],
                hand: ['seeds-of-aggression', 'pride']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['hammer-knight', 'gilder'],
                spellboard: []
            }
        });
    });

    it('chosen units deal attack damage to each other', function () {
        this.player1.play(this.seedsOfAggression);
        this.player1.clickCard(this.fluteMage);

        this.player1.clickCard(this.hammerKnight);

        expect(this.hammerKnight.damage).toBe(1);
        expect(this.fluteMage.location).toBe('discard');
    });
});
