describe('Odette Diamondcrest', function () {
    describe('Enter The Fray', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'odette-diamondcrest',
                    inPlay: ['hammer-knight'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['cover', 'molten-gold']
                },
                player2: {
                    phoenixborn: 'saria-guideman',
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['sympathy-pain'],
                    inPlay: ['flute-mage']
                }
            });
        });

        it('can be played to deal damage to a Unit', function () {
            this.player1.clickCard(this.odetteDiamondcrest); // use ability
            this.player1.clickPrompt('Enter the Fray');
            this.player1.clickCard(this.fluteMage);

            expect(this.fluteMage.location).toBe('discard');
            expect(this.odetteDiamondcrest.damage).toBe(this.fluteMage.attack);
        });


    });

    describe('BUG:Enter The Fray vs Final Cry and Damage Timing', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'odette-diamondcrest',
                    inPlay: ['hammer-knight', 'mist-spirit'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'ceremonial'],
                    hand: ['cover', 'molten-gold', 'final-cry']
                },
                player2: {
                    phoenixborn: 'saria-guideman',
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: [],
                    inPlay: ['flute-mage']
                }
            });
        });

        it('can be played to deal damage to a Unit', function () {
            this.player1.clickCard(this.odetteDiamondcrest); // use ability
            this.player1.clickPrompt('Enter the Fray');
            this.player1.clickCard(this.mistSpirit);
            expect(this.player1).not.toHaveDefaultPrompt(); // reaction prompt
            expect(this.odetteDiamondcrest.damage).toBe(0);
            this.player1.clickCard(this.finalCry);

            expect(this.sariaGuideman.damage).toBe(2);
            expect(this.odetteDiamondcrest.damage).toBe(1);
            expect(this.mistSpirit.location).toBe('archives');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });


});
