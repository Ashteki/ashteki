describe('Summon Steadfast Guardian', function () {
    describe('Summon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['steadfast-guardian'],
                    spellboard: ['summon-steadfast-guardian'],
                    dicepool: ['divine', 'charm', 'ceremonial', 'natural'],
                    archives: ['steadfast-guardian']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });

            this.player1.inPlay[0].tokens.exhaustion = 1;
            this.player1.inPlay[0].tokens.damage = 1;
        });

        it('should place a guardian play', function () {
            this.player1.clickCard(this.summonSteadfastGuardian);
            this.player1.clickPrompt('Summon Steadfast Guardian');

            expect(this.player1.inPlay.length).toBe(2);
            expect(this.player1.inPlay.every((c) => !c.exhausted)).toBe(false);
            expect(this.player1.inPlay.every((c) => c.damage === 0)).toBe(false);
        });
    });

    describe('Focus 1 Summon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['steadfast-guardian'],
                    spellboard: [
                        'summon-steadfast-guardian',
                        'summon-steadfast-guardian'
                    ],
                    dicepool: ['divine', 'charm', 'ceremonial', 'natural'],
                    archives: ['steadfast-guardian']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('remove 1 exhaustion from steadfast guardian in play', function () {
            this.player1.inPlay[0].tokens.exhaustion = 1;
            expect(this.player1.inPlay[0].exhausted).toBe(true);
            expect(this.player1.inPlay[0].damage).toBe(0);
            this.player1.clickCard(this.summonSteadfastGuardian);
            this.player1.clickPrompt('Summon Steadfast Guardian');

            this.player1.clickCard(this.player1.inPlay[0]);
            expect(this.player1.inPlay.length).toBe(2);
            expect(this.player1.inPlay.every((c) => !c.exhausted)).toBe(true);
        });

        it('remove 1 exhaustion from wounded steadfast guardian in play', function () {
            this.player1.inPlay[0].tokens.exhaustion = 1;
            this.player1.inPlay[0].tokens.damage = 1;
            expect(this.player1.inPlay[0].exhausted).toBe(true);
            expect(this.player1.inPlay[0].damage).toBe(1);
            this.player1.clickCard(this.summonSteadfastGuardian);
            this.player1.clickPrompt('Summon Steadfast Guardian');

            this.player1.clickCard(this.player1.inPlay[0]);
            expect(this.player1.inPlay.length).toBe(2);
            expect(this.player1.inPlay.every((c) => !c.exhausted)).toBe(true);
            expect(this.player1.inPlay.every((c) => c.damage === 0)).toBe(true);
        });

    });

    describe('Focus 1 Summon when at limit', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['steadfast-guardian', 'steadfast-guardian'],
                    spellboard: ['summon-steadfast-guardian', 'summon-steadfast-guardian'],
                    dicepool: ['divine', 'charm', 'ceremonial', 'natural'],
                    archives: []
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('removes 1 exhaustion from steadfast guardian in play', function () {
            this.player1.inPlay[0].tokens.exhaustion = 1;
            expect(this.player1.inPlay[0].exhausted).toBe(true);
            expect(this.player1.inPlay[0].damage).toBe(0);
            this.player1.clickCard(this.summonSteadfastGuardian);
            this.player1.clickPrompt('Summon Steadfast Guardian');

            this.player1.clickCard(this.player1.inPlay[0]);
            expect(this.player1.inPlay.length).toBe(2);
            expect(this.player1.inPlay.every((c) => !c.exhausted)).toBe(true);
        });
    });
});
