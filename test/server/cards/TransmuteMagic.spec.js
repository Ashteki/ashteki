describe('Transmute Magic', function () {
    describe('Played', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: [],
                    spellboard: [],
                    dicepool: [
                        'natural',
                        'natural',
                        'sympathy',
                        'sympathy',
                        'natural',
                        'natural',
                        'sympathy',
                        'sympathy'
                    ],
                    hand: ['river-skald', 'living-doll', 'transmute-magic']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['hammer-knight'],
                    spellboard: ['summon-butterfly-monk'],
                    dicepool: ['natural']
                }
            });

            // exhaust 2 dice
            this.player1.dicepool[0].exhaust();
            this.player1.dicepool[1].level = 'basic';
            this.player1.dicepool[1].exhaust();
            // lower 1 dice to basic
            this.player1.dicepool[4].level = 'basic';
        });

        it('should prompt the user to mess around with dice', function () {
            this.player1.clickCard(this.transmuteMagic);
            this.player1.clickPrompt('Play this Action');
            expect(this.player1.dicepool.filter((d) => d.exhausted).length).toBe(3);
            // choose exhausted dice
            this.player1.clickDie(0);
            this.player1.clickDie(1);
            this.player1.clickDone();
            // choose 2 active dice
            this.player1.clickDie(7);
            this.player1.clickDie(5);
            this.player1.clickDone();

            // switched but no change overall
            expect(this.player1.dicepool.filter((d) => d.exhausted).length).toBe(3);
            expect(this.player1.dicepool[0].exhausted).toBe(false);
            expect(this.player1.dicepool[1].level).toBe('power');
            expect(this.player1.dicepool[1].exhausted).toBe(false);

            expect(this.player1.dicepool[5].exhausted).toBe(true);
            expect(this.player1.dicepool[7].exhausted).toBe(true);
            // then change a single active die in mine

            this.player1.clickDie(4);
            expect(this.player1.dicepool[4].level).toBe('power');
            this.player1.clickDone();

            // then change a single active die in theirs
            this.player1.clickOpponentDie(0);
            expect(this.player2.dicepool[0].level).toBe('basic');
            this.player1.clickDone();
        });
    });
});
