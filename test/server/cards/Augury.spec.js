describe('Augury', function () {
    describe('Enters Play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'leo-sunshadow',
                    inPlay: ['mist-spirit', 'iron-worker'],
                    dicepool: ['sympathy', 'natural', 'charm', 'charm'],
                    hand: ['augury']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['hammer-knight'],
                    dicepool: ['natural', 'natural']
                }
            });
        });

        it('add 3 status tokens to card', function () {
            this.player1.clickCard(this.augury);
            this.player1.clickPrompt('Play this ready spell');
            this.player1.clickDie(1);
            this.player1.clickPrompt('Done');

            expect(this.augury.status).toBe(3);
        });
    });

    describe('On Spellboard with 3 status', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'leo-sunshadow',
                    inPlay: ['mist-spirit'],
                    dicepool: ['ceremonial', 'natural', 'charm', 'charm'],
                    spellboard: ['augury'],
                    deck: ['anchornaut', 'iron-worker', 'blood-archer']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['hammer-knight'],
                    dicepool: ['natural', 'natural'],
                    hand: ['choke']
                }
            });
            this.augury.tokens.status = 3;
        });

        it('ability searches for card with 3 cost', function () {
            this.player1.clickCard(this.augury);
            this.player1.clickPrompt('Augury Search');

            expect(this.player1).toBeAbleToSelect(this.bloodArcher);
            expect(this.player1).not.toBeAbleToSelect(this.anchornaut);
            expect(this.player1).not.toBeAbleToSelect(this.hammerKnight);
            expect(this.player1).not.toBeAbleToSelect(this.ironWorker);
            this.player1.clickCard(this.bloodArcher);
            expect(this.bloodArcher.location).toBe('hand');
            expect(this.augury.status).toBe(2);
        });
    });

    describe('On Spellboard with 2 status', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'leo-sunshadow',
                    inPlay: ['mist-spirit'],
                    dicepool: ['ceremonial', 'natural', 'charm', 'charm'],
                    spellboard: ['augury'],
                    deck: ['anchornaut', 'iron-worker', 'blood-archer']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['hammer-knight'],
                    dicepool: ['natural', 'natural'],
                    hand: ['choke']
                }
            });
            this.augury.tokens.status = 2;
        });

        it('ability searches for card with 2 cost', function () {
            this.player1.clickCard(this.augury);
            this.player1.clickPrompt('Augury Search');

            expect(this.player1).not.toBeAbleToSelect(this.bloodArcher);
            expect(this.player1).not.toBeAbleToSelect(this.anchornaut);
            expect(this.player1).not.toBeAbleToSelect(this.hammerKnight);
            expect(this.player1).toBeAbleToSelect(this.ironWorker);
            this.player1.clickCard(this.ironWorker);
            expect(this.ironWorker.location).toBe('hand');
            expect(this.augury.status).toBe(1);
        });
    });
});
