describe('Full Moon', function () {
    describe('Unfocused', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'odette-diamondcrest',
                    inPlay: ['crimson-bomber', 'anchornaut', 'iron-worker'],
                    dicepool: ['divine', 'charm', 'divine', 'charm'],
                    hand: [],
                    spellboard: ['full-moon']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['silver-snake', 'hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('choose one unit and add 1 attack', function () {
            this.player1.useAbility(this.fullMoon);

            this.player1.clickCard(this.anchornaut);
            this.player1.clickDone();

            expect(this.anchornaut.attack).toBe(1);
            expect(this.fullMoon.exhausted).toBe(true);

            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('focus 2', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'odette-diamondcrest',
                    inPlay: ['crimson-bomber', 'anchornaut', 'iron-worker'],
                    dicepool: ['divine', 'charm', 'divine', 'charm'],
                    hand: [],
                    spellboard: ['full-moon', 'full-moon', 'full-moon']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['silver-snake', 'hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('choose 3 units and add 1 attack', function () {
            this.player1.useAbility(this.fullMoon);

            this.player1.clickCard(this.anchornaut);
            this.player1.clickCard(this.crimsonBomber);
            this.player1.clickCard(this.ironWorker);
            this.player1.clickDone();

            expect(this.anchornaut.attack).toBe(1);
            expect(this.crimsonBomber.attack).toBe(4);
            expect(this.ironWorker.attack).toBe(3);
            expect(this.fullMoon.exhausted).toBe(true);

            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
