describe('Transmute Magic', function () {
    describe('Played with ', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: [],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'natural', 'sympathy'],
                    hand: ['river-skald', 'living-doll', 'transmute-magic']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['hammer-knight'],
                    spellboard: ['summon-butterfly-monk'],
                    dicepool: ['natural']
                }
            });

            // exhaust lots of dice -  more than active
            this.player1.dicepool[0].exhaust();
            this.player1.dicepool[1].level = 'basic';
            this.player1.dicepool[1].exhaust();
            this.player1.dicepool[2].level = 'basic';
            this.player1.dicepool[2].exhaust();
            // lower 1 dice to basic
            this.player1.dicepool[4].level = 'basic';
        });

        it('should prompt the user to mess around with dice', function () {
            this.player1.clickCard(this.transmuteMagic);
            this.player1.clickPrompt('Play this Action');
            expect(this.player1.dicepool.filter((d) => d.exhausted).length).toBe(4); // 3 fixed plus symp
            // choose exhausted dice
            this.player1.clickDie(0);
            this.player1.clickDie(1);
            this.player1.clickDie(2); // should not allow this - bug reported
            expect(this.player1.player.selectedDice.length).toBe(2);
            this.player1.clickDone();
            // choose 2 active dice
            this.player1.clickDie(3);
            this.player1.clickDie(4);
            expect(this.player1.player.selectedDice.length).toBe(2);
            this.player1.clickDone();

            // switched but no change overall to exhausted numbers
            expect(this.player1.dicepool.filter((d) => d.exhausted).length).toBe(4);
            expect(this.player1.dicepool[0].exhausted).toBe(false);
            expect(this.player1.dicepool[1].level).toBe('power');
            expect(this.player1.dicepool[1].exhausted).toBe(false);

            expect(this.player1.dicepool[3].exhausted).toBe(true);
            expect(this.player1.dicepool[4].exhausted).toBe(true);
            // then change a single active die in mine

            this.player1.clickDie(1);
            expect(this.player1.dicepool[1].level).toBe('power');
            this.player1.clickDone();

            // then change a single active die in theirs
            this.player1.clickOpponentDie(0);
            expect(this.player2.dicepool[0].level).toBe('basic');
            this.player1.clickDone();
        });
    });
});
