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
                    dicepool: ['natural', 'time', 'natural']
                }
            });
        });

        it('discard damages opponents pb on empty hand', function () {
            expect(this.rinNorthfell.damage).toBe(0);
            expect(this.player2.hand.length).toBe(0);

            this.player1.clickCard(this.anguish);
            this.player1.clickPrompt('Play this action');
            this.player1.clickDie(2);
            this.player1.clickDie(3);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.rinNorthfell);
            expect(this.player1).not.toHavePromptButton('Discard');
            this.player2.clickPrompt('Take 2 Wounds');

            expect(this.rinNorthfell.damage).toBe(2);
        });

        it('damage damages opponents pb', function () {
            expect(this.rinNorthfell.damage).toBe(0);

            this.player1.clickCard(this.anguish);
            this.player1.clickPrompt('Play this action');
            this.player1.clickDie(2);
            this.player1.clickDie(3);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.rinNorthfell);
            this.player2.clickPrompt('Take 2 wounds');

            expect(this.rinNorthfell.damage).toBe(2);
        });

        it('damage followed by damage choice', function () {
            expect(this.rinNorthfell.damage).toBe(0);

            this.player1.clickCard(this.anguish);
            this.player1.clickPrompt('Play this action');
            this.player1.clickDie(2);
            this.player1.clickDie(3);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.rinNorthfell);
            //first part
            this.player2.clickPrompt('Take 2 wounds');
            // second part
            this.player1.clickOpponentDie(0);
            this.player1.clickOpponentDie(1);
            this.player1.clickDone();

            this.player2.clickPrompt('Take 2 wounds');

            expect(this.player1).toHaveDefaultPrompt();
            expect(this.rinNorthfell.damage).toBe(4);
        });

        it('empty hand damage followed by no target dice damage', function () {
            expect(this.rinNorthfell.damage).toBe(0);
            this.player2.dicepool[0].exhaust();
            this.player2.dicepool[1].exhaust();

            this.player1.clickCard(this.anguish);
            this.player1.clickPrompt('Play this action');
            this.player1.clickDie(2);
            this.player1.clickDie(3);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.rinNorthfell);
            this.player2.clickPrompt('Take 2 wounds');
            // second part
            // this.player2.clickPrompt('Exhaust 2 dice');
            // can't so damage taken
            expect(this.rinNorthfell.damage).toBe(4);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('With cards in hand and ready dice', function () {
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

        it('discard removes card with no damage and exhaust choice exhausts dice', function () {
            expect(this.rinNorthfell.damage).toBe(0);
            expect(this.player2.dicepool[0].exhausted).toBe(false);
            expect(this.player2.dicepool[1].exhausted).toBe(false);

            this.player1.clickCard(this.anguish);
            this.player1.clickPrompt('Play this action');
            this.player1.clickDie(2);
            this.player1.clickDie(3);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.rinNorthfell);

            this.player2.clickPrompt('Discard');
            this.player1.clickOpponentDie(0);
            this.player1.clickOpponentDie(1);
            this.player1.clickPrompt('Done');

            this.player2.clickPrompt('Exhaust 2 Dice');
            expect(this.player2.dicepool[0].exhausted).toBe(true);
            expect(this.player2.dicepool[1].exhausted).toBe(true);

            expect(this.rinNorthfell.damage).toBe(0);
            expect(this.player2.hand.length).toBe(0);
        });
    });
});
