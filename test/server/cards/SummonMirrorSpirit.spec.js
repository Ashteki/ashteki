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
            // enters play - reflect sorrow
            this.player1.clickPrompt("Opponent's");
            expect(this.mirrorSpirit.location).toBe('play area');
            // no focus prompt
            expect(this.player1).toHaveDefaultPrompt();
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
            // enters play - reflect sorrow
            this.player1.clickPrompt("Opponent's");

            expect(this.mirrorSpirit.location).toBe('play area');
            expect(this.mirrorSpirit.status).toBe(1);
            this.player1.clickYes(); // remove status to exhaust a unit
            this.player1.clickCard(this.mirrorSpirit);
            this.player1.clickCard(this.hammerKnight);
            expect(this.hammerKnight.exhausted).toBe(true);
        });
    });

    describe('without conjurations', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: [],
                    spellboard: ['summon-mirror-spirit', 'summon-mirror-spirit'],
                    dicepool: ['sympathy', 'natural', 'natural', 'natural'],
                    archives: [] // no mirror spirit in archives
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight', 'iron-worker'],
                    spellboard: []
                }
            });
            this.ironWorker.tokens.exhaustion = 1;
        });

        it('gives warning', function () {
            this.player1.clickCard(this.summonMirrorSpirit);
            this.player1.clickPrompt('Summon Mirror Spirit');
            expect(this.player1).toHavePrompt('Warning');
        });
    });
});
