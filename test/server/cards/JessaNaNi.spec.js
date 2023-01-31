describe('Jessa Na Ni', function () {
    describe('Standard Triggers', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'jessa-na-ni',
                    inPlay: ['iron-worker'],
                    dicepool: ['natural', 'illusion', 'charm', 'charm'],
                    spellboard: [],
                    hand: []
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut'],
                    spellboard: ['summon-iron-rhino'],
                    dicepool: ['natural', 'illusion', 'ceremonial', 'ceremonial'],
                    hand: []
                }
            });
        });

        it('ability triggers on unit destruction', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.anchornaut);
            this.player1.clickCard(this.ironWorker);
            this.player2.clickPrompt('Done'); // no guard
            this.player2.clickPrompt('No'); // no counter
            expect(this.anchornaut.location).toBe('discard');
            // prompt for jessa
            expect(this.player1).toHavePrompt('Any reactions to Anchornaut being destroyed?');
            this.player1.clickCard(this.jessaNaNi);
            this.player1.clickDie(1);
            expect(this.coalRoarkwin.damage).toBe(1);
        });

        it('pass ability', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.anchornaut);
            this.player1.clickCard(this.ironWorker);
            this.player2.clickPrompt('Done'); // no guard
            this.player2.clickPrompt('No'); // no counter
            expect(this.anchornaut.location).toBe('discard');
            // prompt for jessa
            expect(this.player1).toHavePrompt('Any reactions to Anchornaut being destroyed?');
            this.player1.pass();
            expect(this.coalRoarkwin.damage).toBe(0);
            expect(this.player1).not.toHavePrompt('Any reactions to Anchornaut being destroyed?');
        });
    });

    describe('after reactions', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker'],
                    spellboard: ['summon-iron-rhino'],
                    dicepool: ['natural', 'illusion', 'ceremonial', 'ceremonial'],
                    hand: []
                },
                player2: {
                    phoenixborn: 'jessa-na-ni',
                    inPlay: ['anchornaut'],
                    dicepool: ['natural', 'ceremonial', 'charm', 'charm'],
                    spellboard: [],
                    hand: ['final-cry']
                }
            });
        });

        it('ability triggers after final cry', function () {
            this.player1.clickAttack(this.anchornaut);
            this.player1.clickCard(this.ironWorker);
            this.player2.clickPrompt('Done'); // no guard
            this.player2.clickPrompt('No'); // no counter
            expect(this.anchornaut.location).toBe('discard');
            // prompt for jessa
            expect(this.player2).toHavePrompt('Any reactions to Anchornaut being destroyed?');
            this.player2.clickCard(this.finalCry);
            // this.player2.clickDie(1);
            expect(this.coalRoarkwin.damage).toBe(2);
            expect(this.player2).toHavePrompt('Any reactions to Anchornaut being destroyed?');
            this.player2.clickCard(this.jessaNaNi);
            this.player2.clickDie(3);
            expect(this.coalRoarkwin.damage).toBe(3);
        });
    });

    describe('after reactions: BUG report', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'jessa-na-ni',
                    inPlay: ['anchornaut'],
                    dicepool: ['natural', 'ceremonial', 'ceremonial', 'ceremonial'],
                    spellboard: [],
                    hand: ['final-cry', 'blood-chains']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker'],
                    spellboard: ['summon-iron-rhino'],
                    dicepool: ['natural', 'illusion', 'ceremonial', 'ceremonial'],
                    hand: []
                }
            });
        });

        it('ability triggers after final cry', function () {
            this.player1.play(this.bloodChains);
            this.player1.clickCard(this.anchornaut);
            expect(this.anchornaut.location).toBe('discard');
            expect(this.player1).toHavePrompt('Any reactions to Anchornaut being destroyed?');
            this.player1.clickCard(this.finalCry);
            expect(this.coalRoarkwin.damage).toBe(2);

            // prompt for jessa
            expect(this.player1).toHavePrompt('Any reactions to Anchornaut being destroyed?');
            this.player1.clickCard(this.jessaNaNi);
            this.player1.clickDie(3);

            this.player1.clickCard(this.ironWorker);
            expect(this.ironWorker.exhausted).toBe(true);

            expect(this.coalRoarkwin.damage).toBe(3);
        });

        it('ability triggers then offers final cry', function () {
            this.player1.play(this.bloodChains);
            this.player1.clickCard(this.anchornaut);
            expect(this.anchornaut.location).toBe('discard');
            // prompt for jessa
            expect(this.player1).toHavePrompt('Any reactions to Anchornaut being destroyed?');
            this.player1.clickCard(this.jessaNaNi);
            this.player1.clickDie(3);
            expect(this.coalRoarkwin.damage).toBe(1);

            expect(this.player1).toHavePrompt('Any reactions to Anchornaut being destroyed?');
            this.player1.clickCard(this.finalCry);

            this.player1.clickCard(this.ironWorker);
            expect(this.ironWorker.exhausted).toBe(true);

            expect(this.coalRoarkwin.damage).toBe(3);
        });
    });

    describe('Jessa vs Butterfly Monk', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'jessa-na-ni',
                    inPlay: ['fire-archer'],
                    dicepool: ['natural', 'illusion', 'charm', 'charm'],
                    spellboard: [],
                    hand: []
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'butterfly-monk'],
                    spellboard: ['summon-iron-rhino'],
                    dicepool: ['natural', 'illusion', 'ceremonial', 'ceremonial'],
                    hand: []
                }
            });

            this.jessaNaNi.tokens.damage = 2;
        });

        it('ability triggers after monk mend', function () {
            this.player1.clickAttack(this.anchornaut);
            this.player1.clickCard(this.fireArcher);
            this.player2.clickCard(this.butterflyMonk);

            this.player2.clickCard(this.jessaNaNi);
            expect(this.anchornaut.location).toBe('play area');
            // prompt for jessa
            expect(this.player1).toBeAbleToSelect(this.jessaNaNi);
            this.player1.clickCard(this.jessaNaNi);
            this.player1.clickDie(1);
            expect(this.coalRoarkwin.damage).toBe(1);
            expect(this.jessaNaNi.damage).toBe(1);
        });
    });
});
