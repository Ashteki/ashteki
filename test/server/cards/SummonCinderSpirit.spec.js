describe('Summon Cinder Spirit', function () {
    describe('Happy path', function () {
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
            this.player1.endTurn();
            this.player2.endTurn();

            this.player1.clickCard(this.summonCinderSpirit);
            this.player1.clickPrompt('Summon Cinder Spirit');
            this.player1.clickDie(0);
            this.player1.clickDone();
            this.player1.clickCard(this.hammerKnight);
            expect(this.hammerKnight.status).toBe(1);
            expect(this.summonCinderSpirit.status).toBe(0);
            expect(this.cinderSpirit.location).toBe('play area');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('without target unit', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'orrick-gilstream',
                    inPlay: [],
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

        it('no spirit summoned', function () {
            expect(this.player1.actions.main).toBe(true);

            this.player1.clickCard(this.summonCinderSpirit);
            this.player1.clickPrompt('Place Token');
            expect(this.player1.actions.main).toBe(false);
            expect(this.summonCinderSpirit.exhausted).toBe(true);
            expect(this.summonCinderSpirit.status).toBe(1);
            this.player1.endTurn();
            this.player2.endTurn();

            this.player1.clickCard(this.summonCinderSpirit);
            this.player1.clickPrompt('Summon Cinder Spirit');
            this.player1.clickDie(0);
            this.player1.clickDone();
            expect(this.cinderSpirit.location).toBe('archives');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
