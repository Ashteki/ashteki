describe('Seek the Depths', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'lulu-firststone',
                inPlay: ['hammer-knight'],
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
    });

    it('summons a soul delver', function () {
        this.player1.play(this.seekTheDepths);
        this.player1.clickCard(this.purge);
        this.player1.clickDie(0);
        this.player1.clickDie(1);
        this.player1.clickDone();
        expect(this.soulDelver.location).toBe('play area');
        expect(this.luluFirststone.status).toBe(1);
        expect(this.seekTheDepths.location).toBe('deck');
        expect(this.player1).toHaveDefaultPrompt();
    });
});
