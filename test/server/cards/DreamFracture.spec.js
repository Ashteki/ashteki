describe('Dream Fracture', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['iron-worker'],
                dicepool: ['divine', 'divine', 'charm', 'charm', 'sympathy', 'sympathy'],
                spellboard: ['dream-fracture']
            },
            player2: {
                phoenixborn: 'rin-northfell',
                inPlay: ['hammer-knight', 'mist-spirit'],
                spellboard: [],
                hand: ['rins-fury', 'shatter-pulse'],
                dicepool: ['sympathy', 'natural']
            }
        });
    });

    it("changes one of my opponent's dice", function () {
        this.player1.clickCard(this.dreamFracture);
        this.player1.clickPrompt('Dream Fracture');
        this.player1.clickOpponentDie(0);

        expect(this.player2.dicepool[0].level).toBe('class');
        expect(this.player1).toHaveDefaultPrompt();
    });

    it("changes one of my opponent's dice and deals a damage if opponent has no power dice", function () {
        this.player2.dicepool[0].exhaust();
        this.player1.clickCard(this.dreamFracture);
        this.player1.clickPrompt('Dream Fracture');
        this.player1.clickOpponentDie(1);

        expect(this.player2.dicepool[1].level).toBe('class');

        this.player1.clickCard(this.rinNorthfell); // deal a damage to opposing PB
        expect(this.player1).toHaveDefaultPrompt();
        expect(this.rinNorthfell.tokens.damage).toBe(1);
    });

    it("doesn't work if all my opponent's dice are exhausted", function () {
        this.player2.dicepool[0].exhaust();
        this.player2.dicepool[1].exhaust();
        expect(this.player2.dicepool[0].exhausted).toBe(true);
        expect(this.player2.dicepool[1].exhausted).toBe(true);

        expect(this.player1).not.toBeAbleToSelect(this.dreamFracture);
    });
});
