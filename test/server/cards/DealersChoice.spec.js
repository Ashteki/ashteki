describe('Dealers Choice', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'lulu-firststone',
                inPlay: ['hammer-knight'],
                spellboard: ['abundance'],
                dicepool: ['natural', 'sympathy', 'time', 'charm'],
                hand: ['dealers-choice'],
                archives: ['spark']
            },
            player2: {
                phoenixborn: 'saria-guideman',
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                inPlay: ['flute-mage', 'iron-rhino', 'sonic-swordsman'],
                spellboard: ['summon-gilder']
            }
        });

        this.hammerKnight.tokens.status = 2;
    });

    it('pick 2, opponent chooses to exhaust one', function () {
        this.player1.play(this.dealersChoice);
        this.player1.clickCard(this.fluteMage);
        this.player1.clickCard(this.summonGilder);

        this.player2.clickCard(this.sariaGuideman); // does nothing
        this.player2.clickCard(this.summonGilder);
        expect(this.summonGilder.exhausted).toBe(true);
    });

    it('pick 2, opponent chooses to exhaust the other', function () {
        this.player1.play(this.dealersChoice);
        this.player1.clickCard(this.fluteMage);
        this.player1.clickCard(this.summonGilder);

        this.player2.clickCard(this.hammerKnight); // does nothing
        this.player2.clickCard(this.fluteMage);
        expect(this.fluteMage.exhausted).toBe(true);
    });
});
