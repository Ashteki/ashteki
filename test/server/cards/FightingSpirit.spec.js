describe('Fighting Spirit', function () {
    describe('Charge reaction', function () {
        beforeEach(function () {
            this.setupTest({
                player2: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['hammer-knight', 'anchornaut'],
                    dicepool: ['natural', 'time', 'charm', 'charm'],
                    spellboard: ['fighting-spirit']
                },
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural'],
                    inPlay: ['iron-worker'],
                    spellboard: ['chant-of-revenge']
                }
            });

            this.anchornaut.tokens.status = 1;
        });

        it('status token on unit destruction', function () {
            expect(this.fightingSpirit.status).toBe(0);

            this.player1.clickDie(0);
            this.player1.clickPrompt('Natural Dice Power');

            this.player1.clickCard(this.anchornaut);

            expect(this.anchornaut.location).toBe('discard');
            expect(this.fightingSpirit.status).toBe(1);
        });
    });

    describe('Buff unit action', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['hammer-knight', 'anchornaut'],
                    dicepool: ['natural', 'time', 'charm', 'charm'],
                    spellboard: ['fighting-spirit']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural'],
                    inPlay: ['iron-worker'],
                    spellboard: ['chant-of-revenge']
                }
            });

            this.fightingSpirit.tokens.status = 2;
        });

        it('attack buff equal to spell status plus transfer token', function () {
            this.player1.clickCard(this.fightingSpirit);
            this.player1.clickPrompt('Fighting Spirit');

            this.player1.clickCard(this.anchornaut);

            expect(this.anchornaut.attack).toBe(2);
            expect(this.fightingSpirit.status).toBe(1);
            expect(this.anchornaut.status).toBe(1);
        });
    });
});
