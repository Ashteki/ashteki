describe('Slash ability', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
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
        expect(this.hammerKnight.damage).toBe(0);
        this.player1.clickCard(this.coalRoarkwin); // use slash
        this.player1.clickPrompt('Slash');
        this.player1.clickCard(this.cover); // discard
        this.player1.clickCard(this.fluteMage);

        expect(this.fluteMage.damage).toBe(1);
    });

    it('cannot be played without cards in hand', function () {
        this.player1.clearHand();

        this.player1.clickCard(this.coalRoarkwin); // won't trigger slash
        expect(this.player1).toHaveDefaultPrompt();
    });
});
