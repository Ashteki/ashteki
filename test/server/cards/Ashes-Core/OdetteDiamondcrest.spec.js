describe('Odette Diamondcrest', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'odette-diamondcrest',
                inPlay: ['hammer-knight'],
                spellboard: [],
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                hand: ['cover', 'molten-gold']
            },
            player2: {
                phoenixborn: 'saria-guideman',
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                hand: ['sympathy-pain'],
                inPlay: ['flute-mage']
            }
        });
    });

    it('can be played to deal damage to a Unit', function () {
        this.player1.clickCard(this.odetteDiamondcrest); // use ability
        this.player1.clickPrompt('Enter the Fray');
        this.player1.clickCard(this.fluteMage);

        expect(this.fluteMage.location).toBe('discard');
        expect(this.odetteDiamondcrest.damage).toBe(this.fluteMage.attack);
    });
});
