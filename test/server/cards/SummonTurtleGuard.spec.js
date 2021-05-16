describe('Summon Turtle Guard', function () {
    describe('Summon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['ice-golem'],
                    spellboard: ['summon-turtle-guard'],
                    dicepool: ['natural', 'divine', 'divine', 'time'],
                    archives: ['turtle-guard', 'ice-golem']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('should place a turtle guard into play', function () {
            this.player1.clickCard(this.summonTurtleGuard);
            this.player1.clickPrompt('Summon Turtle Guard');
            this.player1.clickDie(0);
            this.player1.clickCard(this.turtleGuard);

            expect(this.turtleGuard.location).toBe('play area');
        });
    });

    describe('Focus 1 Summon - no TG in archives', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['turtle-guard'],
                    spellboard: ['summon-turtle-guard', 'summon-turtle-guard'],
                    dicepool: ['natural', 'divine', 'divine', 'time'],
                    archives: ['ice-golem']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('triggers exhaust prompts', function () {
            this.player1.clickCard(this.summonTurtleGuard);
            this.player1.clickPrompt('Summon Turtle Guard');
            this.player1.clickDie(0);
            // unable to click archives card

            expect(this.player1).toBeAbleToSelect(this.turtleGuard);
            expect(this.player1).not.toHaveDefaultPrompt();
            this.player1.clickCard(this.turtleGuard);
            this.player1.clickCard(this.hammerKnight);

            expect(this.turtleGuard.location).toBe('play area');
            expect(this.turtleGuard.exhausted).toBe(true);
            expect(this.hammerKnight.exhausted).toBe(true);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('Focus 1 Summon - no room in battlefield', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'brennen-blackcloud',
                    inPlay: [
                        'turtle-guard',
                        'ice-golem',
                        'ice-golem',
                        'iron-worker',
                        'iron-worker'
                    ],
                    spellboard: ['summon-turtle-guard', 'summon-turtle-guard'],
                    dicepool: ['natural', 'divine', 'divine', 'time'],
                    archives: ['turtle-guard']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('triggers exhaust prompts', function () {
            this.player1.clickCard(this.summonTurtleGuard);
            this.player1.clickPrompt('Summon Turtle Guard');
            this.player1.clickDie(0);
            this.player1.clickCard(this.player1.archives[0]); // tries but fails

            expect(this.player1).not.toHaveDefaultPrompt();
            this.player1.clickCard(this.player1.inPlay[0]);
            this.player1.clickCard(this.hammerKnight);

            expect(this.player1.inPlay[0].exhausted).toBe(true);
            expect(this.hammerKnight.exhausted).toBe(true);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('Focus No Summon - choice not to place TG', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'brennen-blackcloud',
                    inPlay: [
                        'turtle-guard',
                        'ice-golem',
                        'ice-golem',
                        'iron-worker',
                        'iron-worker'
                    ],
                    spellboard: ['summon-turtle-guard', 'summon-turtle-guard'],
                    dicepool: ['natural', 'divine', 'divine', 'time'],
                    archives: ['turtle-guard']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('triggers exhaust prompts', function () {
            this.player1.clickCard(this.summonTurtleGuard);
            this.player1.clickPrompt('Focus Without Summon');
            this.player1.clickDie(0);

            expect(this.player1).not.toHaveDefaultPrompt();
            this.player1.clickCard(this.player1.inPlay[0]);
            this.player1.clickCard(this.hammerKnight);

            expect(this.player1.inPlay[0].exhausted).toBe(true);
            expect(this.hammerKnight.exhausted).toBe(true);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
