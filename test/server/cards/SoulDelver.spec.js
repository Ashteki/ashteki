describe('Soul Delver', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'lulu-firststone',
                inPlay: ['hammer-knight', 'soul-delver'],
                spellboard: ['abundance'],
                dicepool: ['natural', 'sympathy', 'time', 'charm'],
                hand: ['seek-the-depths', 'purge'],
                archives: ['spark', 'soul-delver']
            },
            player2: {
                phoenixborn: 'saria-guideman',
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                hand: ['sympathy-pain'],
                inPlay: ['flute-mage', 'iron-rhino', 'sonic-swordsman']
            }
        });
        this.luluFirststone.tokens.status = 1;
    });

    it('lower die on attack', function () {
        expect(this.player2.dicepool[0].level).toBe('power');
        this.player1.clickAttack(this.sariaGuideman);
        this.player1.clickCard(this.soulDelver);
        this.player1.clickDone();
        this.player1.clickOpponentDie(0);

        expect(this.player2.dicepool[0].level).toBe('class');
    });
});
