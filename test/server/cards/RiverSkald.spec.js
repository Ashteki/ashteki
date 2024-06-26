describe('River Skald', function () {
    describe('Harsh Melody', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: [],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'sympathy', 'sympathy'],
                    hand: ['river-skald', 'living-doll', 'molten-gold']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['hammer-knight'],
                    spellboard: ['summon-butterfly-monk']
                }
            });
        });

        it('should deal damage to a target unit equal to a discarded card magic cost', function () {
            expect(this.hammerKnight.damage).toBe(0);

            this.player1.clickCard(this.riverSkald);
            this.player1.clickPrompt('Play this Ally');
            this.player1.clickYes(); // optional / may clause
            expect(this.player1).toHavePrompt('Choose a card to discard');

            this.player1.clickCard(this.livingDoll); // in hand
            this.player1.clickCard(this.hammerKnight);
            expect(this.hammerKnight.damage).toBe(2);
            expect(this.riverSkald.location).toBe('play area');
            expect(this.livingDoll.location).toBe('discard');
        });

        it('should be optional', function () {
            expect(this.hammerKnight.damage).toBe(0);

            this.player1.clickCard(this.riverSkald);
            this.player1.clickPrompt('Play this Ally');
            this.player1.clickNo(); // optional / may clause

            expect(this.player1).not.toHavePrompt('Choose a card to discard');
            expect(this.player1).toHaveDefaultPrompt();
        });

    });

    describe('Bug report: Harsh Melody specific combination', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: [],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'sympathy', 'sympathy'],
                    hand: ['river-skald', 'old-salt', 'molten-gold']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['shimmer-wing'],
                    spellboard: ['summon-butterfly-monk']
                }
            });
        });

        it('should deal damage to a target unit equal to a discarded card magic cost', function () {
            expect(this.shimmerWing.damage).toBe(0);

            this.player1.clickCard(this.riverSkald);
            this.player1.clickPrompt('Play this Ally');
            this.player1.clickYes(); // optional / may clause
            expect(this.player1).toHavePrompt('Choose a card to discard');

            this.player1.clickCard(this.oldSalt); // in hand
            this.player1.clickCard(this.shimmerWing);
            expect(this.shimmerWing.location).toBe('archives');
            expect(this.riverSkald.location).toBe('play area');
            expect(this.oldSalt.location).toBe('discard');
        });
    });
});
