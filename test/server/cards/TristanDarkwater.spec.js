describe('Tristan Darkwater, magnify', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'tristan-darkwater',
                inPlay: ['prism-tetra', 'raptor-hatchling'],
                spellboard: [],
                dicepool: ['time', 'natural', 'charm', 'charm'],
                hand: ['cover', 'molten-gold'],
                deck: ['golden-veil', 'choke', 'fester', 'abundance', 'raptor-herder']
            },
            player2: {
                phoenixborn: 'saria-guideman',
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                hand: ['sympathy-pain'],
                inPlay: ['flute-mage']
            }
        });
    });

    it('tutor, shuffle, then place on top', function () {
        this.player1.clickCard(this.tristanDarkwater);
        this.player1.clickPrompt('Magnify');
        this.player1.clickDie(0);
        this.player1.clickCard(this.prismTetra);
        this.player1.clickCard(this.raptorHatchling);
        this.player1.clickDone();
        expect(this.prismTetra.getKeywordValue('grouptactics')).toBe(1);

        this.player1.clickAttack(this.sariaGuideman);
        this.player1.clickCard(this.prismTetra);
        this.player1.clickDone();

        expect(this.prismTetra.isAttacker).toBe(true);
        expect(this.prismTetra.getKeywordValue('grouptactics')).toBe(2);
    });
});
