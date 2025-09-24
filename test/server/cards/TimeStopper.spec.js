describe('Timestopper', function () {
    describe('played as reaction', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['mist-spirit', 'iron-worker'],
                    spellboard: ['summon-butterfly-monk'],
                    hand: ['beast-tamer'],
                    dicepool: ['charm', 'charm']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['flute-mage'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'illusion', 'illusion', 'time', 'time'],
                    hand: ['timestopper'],
                    archives: ['sleeping-widow']
                }
            });

            this.player2.actions.main = false; // shouldn't need this
            this.fluteMage.tokens.damage = 1;
        });

        it('reaction to play after opponent unit enters play', function () {
            this.player1.play(this.beastTamer);

            expect(this.player2).toBeAbleToSelect(this.timestopper);

            this.player2.clickCard(this.timestopper);

            expect(this.timestopper.location).toBe('play area');
            expect(this.player2.player.limitedPlayed).toBe(1);

            // target unit to affect
            this.player2.clickCard(this.ironWorker);
            expect(this.ironWorker.checkRestrictions('block')).toBe(false);
            expect(this.ironWorker.checkRestrictions('guard')).toBe(false);
            expect(this.ironWorker.checkRestrictions('attack')).toBe(false);

            expect(this.player1).toHaveDefaultPrompt();
            this.player1.endTurn(); // end player1 turn (no trigger)
            expect(this.ironWorker.checkRestrictions('block')).toBe(false);
            this.player2.endTurn(); // end next turn (triggers end)
            expect(this.ironWorker.checkRestrictions('block')).toBe(true);
        });
    });


});
