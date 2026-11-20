describe('Tailwind', function () {
    describe('Standard ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'kanna-galeheart',
                    inPlay: ['anchornaut', 'mist-spirit'],
                    spellboard: ['tailwind', 'frost-bite'],
                    dicepool: ['astral', 'astral', 'charm', 'natural']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['mist-spirit'],
                    spellboard: []
                }
            });
        });

        it('if pb is airborne adds 1 to unit attack value', function () {
            this.player1.attachDie(0, this.kannaGaleheart);
            expect(this.kannaGaleheart.isAirborne).toBe(true);
            this.player1.clickCard(this.tailwind);
            this.player1.clickPrompt('Tailwind');

            expect(this.anchornaut.attack).toBe(1);
            expect(this.mistSpirit.attack).toBe(2);

            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('when focussed ', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'kanna-galeheart',
                    inPlay: ['anchornaut', 'mist-spirit'],
                    spellboard: ['tailwind', 'tailwind', 'frost-bite'],
                    dicepool: ['astral', 'astral', 'charm', 'natural']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['mist-spirit'],
                    spellboard: []
                }
            });
        });

        it('if pb is airborne adds 1 to unit attack value and allows an extra side action for a basic die', function () {
            this.player1.attachDie(0, this.kannaGaleheart);
            expect(this.kannaGaleheart.isAirborne).toBe(true);
            this.player1.clickCard(this.tailwind);
            this.player1.clickPrompt('Tailwind');

            expect(this.anchornaut.attack).toBe(1);
            expect(this.mistSpirit.attack).toBe(2);

            this.player1.clickYes();
            this.player1.clickDie(2);
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.player1.actions.side).toBe(1);
        });
    });
});
