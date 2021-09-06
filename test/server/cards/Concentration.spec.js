describe('Concentration', function () {
    describe('Action', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'orrick-gilstream',
                    inPlay: ['hammer-knight', 'anchornaut'],
                    dicepool: ['natural', 'time', 'charm', 'charm', 'time'],
                    spellboard: ['concentration'],
                    hand: ['iron-worker'],
                    archives: ['the-awakened-state']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural'],
                    inPlay: ['iron-worker'],
                    spellboard: ['chant-of-revenge']
                }
            });

            this.orrickGilstream.tokens.status = 7;
        });

        it('attach awakened state to orrick', function () {
            expect(this.orrickGilstream.status).toBe(7);
            this.player1.clickCard(this.concentration);
            this.player1.clickPrompt('Concentration');
            this.player1.clickPrompt('main');
            this.player1.clickDie(0);
            this.player1.clickDie(1);
            this.player1.clickDone();
            this.player1.clickDone(); // choose exhausted dice
            expect(this.orrickGilstream.upgrades.length).toBe(1);
            expect(this.player1.hand.length).toBe(2);
            expect(this.orrickGilstream.status).toBe(8);
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('dont attach awakened state to orrick when status less than 7', function () {
            this.orrickGilstream.tokens.status = 3;
            const target = this.player1.dicepool[2];
            target.exhausted = true;
            target.level = 'class';

            expect(this.orrickGilstream.status).toBe(3);
            this.player1.clickCard(this.concentration);
            this.player1.clickPrompt('Concentration');
            this.player1.clickPrompt('main');
            this.player1.clickDie(0);
            this.player1.clickDie(1);
            this.player1.clickDone();
            this.player1.clickDie(2); // choose exhausted die
            this.player1.clickDone();
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.orrickGilstream.upgrades.length).toBe(0);
            expect(this.player1.hand.length).toBe(2);
            expect(this.orrickGilstream.status).toBe(4);
            expect(target.level).toBe('power');
            expect(target.exhausted).toBe(false);
        });
    });
});
