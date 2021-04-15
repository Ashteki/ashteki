describe('Summon Mirror Spirit', function () {
    describe('Summon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['ice-golem'],
                    spellboard: ['summon-mirror-spirit'],
                    dicepool: ['sympathy', 'natural', 'natural', 'natural'],
                    archives: ['mirror-spirit']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });

            this.player1.inPlay[0].tokens.damage = 1;
        });

        it('should place an mirror spirit into play', function () {
            this.player1.clickCard(this.summonMirrorSpirit);
            this.player1.clickPrompt('Summon Mirror Spirit');
            this.player1.clickDie(3);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.player1.archives[0]);

            expect(this.mirrorSpirit.location).toBe('play area');
        });
    });

    describe('Focus 2 Summon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: [],
                    spellboard: ['summon-mirror-spirit', 'summon-mirror-spirit'],
                    dicepool: ['sympathy', 'natural', 'natural', 'natural'],
                    archives: ['mirror-spirit']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight', 'iron-worker'],
                    spellboard: []
                }
            });
            this.ironWorker.tokens.exhaustion = 1;
        });

        it('can remove all status from mirror spirit to exhaust opp unit', function () {
            expect(this.hammerKnight.exhausted).toBe(false);
            this.player1.clickCard(this.summonMirrorSpirit);
            this.player1.clickPrompt('Summon Mirror Spirit');
            this.player1.clickDie(3);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.mirrorSpirit);
            this.player1.clickPrompt("Opponent's");

            expect(this.mirrorSpirit.location).toBe('play area');
            expect(this.mirrorSpirit.status).toBe(1);
            this.player1.clickCard(this.mirrorSpirit);
            this.player1.clickCard(this.hammerKnight);
            expect(this.hammerKnight.exhausted).toBe(true);
        });
    });
});
