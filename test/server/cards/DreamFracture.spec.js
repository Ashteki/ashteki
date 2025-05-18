describe('Dream Fracture', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['iron-worker'],
                dicepool: ['divine', 'divine', 'charm', 'charm', 'sympathy', 'sympathy'],
                spellboard: ['dream-fracture'],
                hand: ['law-of-assurance']
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

    it('doesnt work under changeOpponentsDice restriction', function () {
        this.player1.play(this.lawOfAssurance);
        expect(this.player1.player.checkRestrictions('changeOpponentsDice')).toBe(false); // can't change dice
        this.player1.clickCard(this.dreamFracture);
        this.player1.clickPrompt('Dream Fracture');
        this.player1.clickOpponentDie(0); // does nothing
        expect(this.player2.dicepool[0].level).toBe('power');

        expect(this.rinNorthfell.damage).toBe(0);
        expect(this.player1).toHaveDefaultPrompt();
        expect(this.player1.main).toBe(false);
    });

    it("changes one of my opponent's dice and deals a damage if opponent has no power dice", function () {
        this.player2.dicepool[0].exhaust();
        this.player1.clickCard(this.dreamFracture);
        this.player1.clickPrompt('Dream Fracture');
        this.player1.clickOpponentDie(1);

        expect(this.player2.dicepool[1].level).toBe('class');

        expect(this.player1).toHaveDefaultPrompt();
        expect(this.rinNorthfell.damage).toBe(1);
    });

    it('still deals a damage if my opponent only has basic dice', function () {
        this.player2.dicepool[0].level = 'basic';
        this.player2.dicepool[1].level = 'basic';
        this.player1.clickCard(this.dreamFracture);
        this.player1.clickPrompt('Dream Fracture');
        this.player1.clickOpponentDie(1);

        expect(this.player2.dicepool[1].level).toBe('basic');

        expect(this.player1).toHaveDefaultPrompt();
        expect(this.rinNorthfell.damage).toBe(1);
    });

    it("fizzles if all my opponent's dice are exhausted", function () {
        this.player2.dicepool[0].exhaust();
        this.player2.dicepool[1].exhaust();
        expect(this.player2.dicepool[0].exhausted).toBe(true);
        expect(this.player2.dicepool[1].exhausted).toBe(true);

        this.player1.clickCard(this.dreamFracture);
        this.player1.clickPrompt('Dream Fracture');
        expect(this.rinNorthfell.damage).toBe(0);

        expect(this.player1).toHaveDefaultPrompt();
    });
});
