describe('Recollect Action Spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'orrick-gilstream',
                inPlay: ['hammer-knight', 'anchornaut'],
                dicepool: ['natural', 'time', 'charm', 'charm', 'time'],
                spellboard: ['concentration'],
                hand: ['recollect'],
                archives: ['the-awakened-state'],
                deck: ['anchornaut'],
                discard: ['concentration', 'concentration']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                dicepool: ['natural'],
                inPlay: ['iron-worker'],
                spellboard: ['chant-of-revenge']
            }
        });
    });

    it('recall both copies of spell to hand', function () {
        this.player1.play(this.recollect);
        this.player1.clickCard(this.concentration);
        expect(this.player1.hand.length).toBe(2); // 2 copies of concentration
        expect(this.player1.hand[0].id).toBe('concentration');
        expect(this.player1.hand[1].id).toBe('concentration');
        expect(this.recollect.location).toBe('discard');
    });
});
