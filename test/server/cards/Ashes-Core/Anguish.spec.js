describe('Anguish', function () {
    describe('Empty hand', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'leo-sunshadow',
                    inPlay: ['mist-spirit', 'iron-worker'],
                    dicepool: ['ceremonial', 'natural', 'charm', 'charm'],
                    hand: ['anguish']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['hammer-knight'],
                    dicepool: ['natural', 'natural']
                }
            });
        });

        it('discard damages opponents pb on empty hand', function () {
            expect(this.rinNorthfell.damage).toBe(0);

            this.player1.clickCard(this.anguish);
            this.player1.clickPrompt('Play this action');
            this.player1.clickDie(2);
            this.player1.clickDie(3);
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Discard');

            expect(this.rinNorthfell.damage).toBe(2);
        });

        it('damage damages opponents pb', function () {
            expect(this.rinNorthfell.damage).toBe(0);

            this.player1.clickCard(this.anguish);
            this.player1.clickPrompt('Play this action');
            this.player1.clickDie(2);
            this.player1.clickDie(3);
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Damage');

            expect(this.rinNorthfell.damage).toBe(2);
        });
    });

    describe('With cards in hand', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'leo-sunshadow',
                    inPlay: ['mist-spirit', 'iron-worker'],
                    dicepool: ['ceremonial', 'natural', 'charm', 'charm'],
                    hand: ['anguish']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['hammer-knight'],
                    dicepool: ['natural', 'natural'],
                    hand: ['choke']
                }
            });
        });

        it('discard removes card with no damage', function () {
            expect(this.rinNorthfell.damage).toBe(0);

            this.player1.clickCard(this.anguish);
            this.player1.clickPrompt('Play this action');
            this.player1.clickDie(2);
            this.player1.clickDie(3);
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Discard');

            expect(this.rinNorthfell.damage).toBe(0);
            expect(this.player2.hand.length).toBe(0);
        });
    });
});
