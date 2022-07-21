describe('Hope Everthorn', function () {
    describe('Duplicate', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'hope-everthorn',
                    inPlay: ['shadow-hound'],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'illusion', 'ceremonial'],
                    spellboard: ['summon-shadow-spirit'],
                    hand: ['final-cry'],
                    archives: ['shadow-hound']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['flute-mage']
                }
            });
        });

        it('duplicates', function () {
            const firstHound = this.player1.inPlay[0];
            const secondHound = this.player1.archives[0];
            expect(this.player1.inPlay.length).toBe(1);
            expect(this.player1.archives.length).toBe(1);
            this.player1.clickCard(this.hopeEverthorn);
            this.player1.clickPrompt('Duplicate');
            this.player1.clickDie(0);
            this.player1.clickCard(firstHound);

            expect(this.player1.archives.length).toBe(0);
            expect(firstHound.tokens.duplicate).toBeUndefined();
            expect(secondHound.tokens.duplicate).toBe(1); //check duplicate token applied

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.aradelSummergaard);
            this.player1.clickCard(this.player1.player.unitsInPlay[0]);
            this.player1.clickCard(this.player1.player.unitsInPlay[1]);
            this.player1.clickPrompt('Done');

            this.player2.clickPrompt('Done'); // no blocker

            this.player1.clickCard(this.player1.player.unitsInPlay[0]); //resolve fights in order
            this.player1.clickCard(this.player1.player.unitsInPlay[1]); //resolve fights in order

            expect(this.player1.player.limitedPlayed).toBe(0);
            expect(this.player2.player.limitedPlayed).toBe(0);

            this.player1.endTurn();
            // reactions on turn end
            this.player1.clickCard(this.finalCry);
            this.player1.clickCard(this.fluteMage);
            // then reaction count should reset
            expect(this.player1.player.limitedPlayed).toBe(0);
            expect(this.player2.player.limitedPlayed).toBe(0);

            // then it's the new turn
            expect(this.player2).toHaveDefaultPrompt();

            expect(firstHound.location).toBe('play area');
            expect(secondHound.location).toBe('archives');
            expect(this.player1.inPlay.length).toBe(1);
            expect(this.player1.archives.length).toBe(1);
        });
    });
});
