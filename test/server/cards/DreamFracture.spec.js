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
        this.player1.clickCard(this.dreamFracture); // Moving the condition up to the top level results in the ability to click this card to disappear
        this.player1.clickPrompt('Dream Fracture');

        this.player1.clickOpponentDie(0);
        //this.player1.clickPrompt('Done');
        expect(this.player2.dicepool[0].level).toBe('class');

        expect(this.player1).toHaveDefaultPrompt();
    });

    it("doesn't work if all my opponent's dice are exhausted", function () {
        this.player2.dicepool[0].exhaust();
        this.player2.dicepool[1].exhaust();
        expect(this.player2.dicepool[0].exhausted).toBe(true);
        expect(this.player2.dicepool[1].exhausted).toBe(true);

        this.player1.clickCard(this.dreamFracture);
        this.player1.clickPrompt('Dream Fracture');

        //this.player1.clickOpponentDie(0);
        //expect(this.player2.dicepool[0].level).toBe('power'); // didn't change die

        expect(this.player1).toHaveDefaultPrompt(); // Currently this is testing false as the condition on target doesn't restrict
    });
});
