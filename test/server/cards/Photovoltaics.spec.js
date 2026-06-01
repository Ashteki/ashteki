describe('Photovoltaics', function () {
    describe('charge', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'maeve-luminvale',
                    inPlay: ['flute-mage', 'thunder-hulk', 'floral-tyrant'],
                    dicepool: ['natural', 'natural', 'artifice', 'artifice'],
                    spellboard: ['photovoltaics'],
                    archives: [],
                    hand: ['anchornaut']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural', 'time', 'time'],
                    inPlay: ['beast-tamer', 'blue-jaguar', 'hammer-knight'],
                    spellboard: ['chant-of-revenge']
                }
            });

            this.player1.dicepool[0].level = 'basic';
            this.player1.dicepool[3].exhaust();
        });

        it('with 0 status adds status and raises die', function () {
            expect(this.player1.dicepool[0].level).toBe('basic');
            expect(this.photovoltaics.status).toBe(0);
            this.player1.useAbility(this.photovoltaics);

            expect(this.photovoltaics.status).toBe(1);

            this.player1.clickDie(0);
            expect(this.player1.dicepool[0].level).toBe('class');

            expect(this.player1).toHaveDefaultPrompt();
        });

        it('with 3 status no build up but triggers dice ability', function () {
            this.photovoltaics.tokens.status = 3;
            expect(this.player1.dicepool[0].level).toBe('basic');
            expect(this.player1.dicepool[3].exhausted).toBe(true);
            expect(this.photovoltaics.status).toBe(3);
            this.player1.useAbility(this.photovoltaics);

            expect(this.photovoltaics.status).toBe(3);

            expect(this.player1.dicepool[0].level).toBe('basic');

            this.player1.clickYes();
            this.player1.clickCard(this.thunderHulk);
            expect(this.thunderHulk.isCharged).toBe(true);
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('with 2 status adds status and raises die then triggers dice ability', function () {
            this.photovoltaics.tokens.status = 2;
            expect(this.player1.dicepool[0].level).toBe('basic');
            expect(this.photovoltaics.status).toBe(2);
            this.player1.useAbility(this.photovoltaics);

            expect(this.photovoltaics.status).toBe(3);

            this.player1.clickDie(0);
            expect(this.player1.dicepool[0].level).toBe('class');

            this.player1.clickNo(); // no dice smuggle
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
