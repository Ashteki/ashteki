describe('Summon Cinder Spirit', function () {
    describe('when not focused', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'orrick-gilstream',
                    inPlay: ['hammer-knight', 'anchornaut'],
                    dicepool: ['ceremonial', 'charm', 'charm', 'time', 'illusion'],
                    spellboard: ['summon-cinder-spirit'],
                    archives: ['cinder-spirit'],
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

        it('main to load status, side to summon', function () {
            expect(this.player1.actions.main).toBe(true);

            this.player1.clickCard(this.summonCinderSpirit);
            this.player1.clickPrompt('Place Token');
            expect(this.player1.actions.main).toBe(false);
            expect(this.summonCinderSpirit.exhausted).toBe(true);
            expect(this.summonCinderSpirit.status).toBe(1);

            this.player1.clickCard(this.summonCinderSpirit);
            this.player1.clickPrompt('Summon Cinder Spirit');
            this.player1.clickDie(0);
            this.player1.clickDone();
            expect(this.cinderSpirit.location).toBe('play area');
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.summonCinderSpirit.status).toBe(0);
        });
    });
});
