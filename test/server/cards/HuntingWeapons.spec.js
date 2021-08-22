describe('Hunting Weapons', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'lulu-firststone',
                inPlay: ['hammer-knight'],
                spellboard: [],
                dicepool: ['natural', 'natural', 'time', 'charm'],
                hand: ['hunting-weapons'],
                archives: ['spark']
            },
            player2: {
                phoenixborn: 'saria-guideman',
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                hand: ['sympathy-pain'],
                inPlay: ['flute-mage']
            }
        });
    });

    it('attack when attached allows ping', function () {
        this.player1.play(this.huntingWeapons, this.hammerKnight);
        expect(this.hammerKnight.upgrades.length).toBe(1);
        this.player1.clickAttack(this.sariaGuideman);
        this.player1.clickCard(this.hammerKnight);
        this.player1.clickDone();
        this.player1.clickCard(this.hammerKnight);

        this.player1.clickCard(this.fluteMage);
        expect(this.fluteMage.damage).toBe(1);
    });
});
