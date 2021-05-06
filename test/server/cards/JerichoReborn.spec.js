describe('Jericho Prepare', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'jericho-reborn',
                inPlay: ['hammer-knight'],
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
        expect(this.hammerKnight.damage).toBe(0);
        this.player1.clickCard(this.jerichoReborn);
        this.player1.clickPrompt('Prepare');
        this.player1.clickCard(this.fester);

        expect(this.fester.location).toBe('deck');
        expect(this.player1.deck[0]).toBe(this.fester);
    });
});
