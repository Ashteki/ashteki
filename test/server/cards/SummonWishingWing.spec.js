describe('Summon Wishing Wing', function () {
    describe('when not focused', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'orrick-gilstream',
                    inPlay: ['hammer-knight', 'anchornaut'],
                    dicepool: ['natural', 'charm', 'charm', 'time', 'illusion'],
                    spellboard: ['summon-wishing-wing'],
                    archives: ['wishing-wing'],
                    deck: ['anchornaut']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural'],
                    inPlay: ['iron-worker'],
                    spellboard: ['chant-of-revenge']
                }
            });
        });

        it('normal summon', function () {

            expect(this.player1.actions.main).toBe(true);
            this.player1.clickCard(this.summonWishingWing);
            this.player1.clickPrompt('Summon Wishing Wing');
            //don't require action type selection
            expect(this.wishingWing.location).toBe('play area');
            expect(this.player1.actions.main).toBe(false);
            expect(this.wishingWing.tokens.status).toBeUndefined();
        });
    });

    describe('summon when focus 2', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'orrick-gilstream',
                    inPlay: ['hammer-knight'],
                    dicepool: ['natural', 'time', 'charm', 'charm', 'time', 'illusion'],
                    spellboard: [
                        'summon-wishing-wing',
                        'summon-wishing-wing',
                        'summon-wishing-wing'
                    ],
                    archives: ['wishing-wing'],
                    deck: ['anchornaut', 'remorse']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural'],
                    inPlay: ['iron-worker'],
                    spellboard: ['chant-of-revenge']
                }
            });
        });

        it('places status token for enter play and focus 2', function () {
            expect(this.player1.actions.main).toBe(true);
            this.player1.clickCard(this.summonWishingWing);
            this.player1.clickPrompt('Summon Wishing Wing');
            //don't require action type selection
            expect(this.wishingWing.location).toBe('play area');
            expect(this.wishingWing.attack).toBe(2);

            expect(this.wishingWing.tokens.status).toBe(2);

            this.player1.endTurn();
            this.player2.clickDie(0);
            this.player2.clickPrompt('Natural Dice Power');
            this.player2.clickCard(this.wishingWing);
            //Check drew 2
            expect(this.anchornaut.location).toBe('hand');
            expect(this.remorse.location).toBe('hand');
        });
    });
});
