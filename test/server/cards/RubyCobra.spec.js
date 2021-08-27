describe('Ruby Cobra', function () {
    describe('Intimidate 1', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['anchornaut', 'ruby-cobra'],
                    dicepool: ['charm', 'time', 'charm', 'charm', 'time'],
                    spellboard: ['captivate'],
                    hand: []
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural'],
                    inPlay: ['iron-worker', 'hammer-knight'],
                    spellboard: ['chant-of-revenge']
                }
            });
        });

        it('restrict attack from charm dice bearer', function () {
            expect(this.player2.discard.length).toBe(0);
            this.player1.clickAttack(this.aradelSummergaard);
            this.player1.clickCard(this.rubyCobra);
            this.player1.clickDone();
            expect(this.rubyCobra.attack).toBe(1);
            expect(this.player2.discard.length).toBe(1);

            this.player2.clickDone();
            this.player1.endTurn();
            expect(this.rubyCobra.attack).toBe(0);
        });
    });

    describe('Charming ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['anchornaut', 'ruby-cobra'],
                    dicepool: ['charm', 'time', 'charm', 'charm', 'time'],
                    spellboard: ['captivate'],
                    hand: []
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural'],
                    inPlay: ['iron-worker', 'hammer-knight'],
                    spellboard: ['chant-of-revenge']
                }
            });
        });

        it('restrict attack from charm dice bearer', function () {
            this.player1.clickDie(0);
            this.player1.clickPrompt('Charm Dice Power');
            expect(this.player1).toBeAbleToSelect(this.ironWorker); // other player
            this.player1.clickCard(this.ironWorker);
            expect(this.ironWorker.dieUpgrades.length).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();

            this.player1.endTurn();
            this.player2.clickAttack(this.rubyCobra);
            expect(this.player2).toBeAbleToSelect(this.hammerKnight);
            expect(this.player2).not.toBeAbleToSelect(this.ironWorker);
        });
    });
});
