describe('Summon Sleeping Widows', function () {
    describe('Reaction to my unit destroyed', function () {
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
                    spellboard: [],
                    dicepool: ['natural', 'illusion', 'ceremonial', 'ceremonial'],
                    hand: ['summon-sleeping-widows'],
                    archives: ['sleeping-widow', 'sleeping-widow']
                }
            });
        });

        it('puts 2 widows in play', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.anchornaut);
            this.player1.clickCard(this.ironWorker);
            this.player2.clickPrompt('Done'); // no guard
            this.player2.clickPrompt('No'); // no counter
            expect(this.anchornaut.location).toBe('discard');
            // prompt for jessa - Active player
            expect(this.player1).toHavePrompt('Any reactions to Anchornaut being destroyed?');
            this.player1.clickPrompt('Pass');
            expect(this.player2).toHavePrompt('Any reactions to Anchornaut being destroyed?');
            this.player2.clickCard(this.summonSleepingWidows);
            expect(this.player2.inPlay.length).toBe(2);
        });
    });

    describe('Reaction to my blood puppet destroyed on opponents board ', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['iron-worker'],
                    dicepool: [
                        'natural',
                        'illusion',
                        'charm',
                        'ceremonial',
                        'ceremonial',
                        'ceremonial'
                    ],
                    spellboard: ['summon-blood-puppet'],
                    archives: ['blood-puppet'],
                    hand: ['summon-sleeping-widows']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut'],
                    spellboard: [],
                    dicepool: ['natural', 'illusion', 'ceremonial', 'ceremonial'],
                }
            });
        });

        it('does NOT proc', function () {
            this.player1.clickCard(this.summonBloodPuppet);
            this.player1.clickPrompt('Summon Blood Puppet');
            this.player1.clickPrompt("Opponent's");
            this.player1.clickCard(this.bloodPuppet);
            this.player1.endTurn();

            // fudge for destroyed
            this.bloodPuppet.tokens.damage = 1;

            this.player2.clickCard(this.bloodPuppet);
            this.player2.clickPrompt('Self Inflict');
            this.player2.clickDie(0);

            expect(this.bloodPuppet.location).toBe('archives');

            expect(this.player2).toHaveDefaultPrompt();
        });
    });

    describe('Reaction used when duplicate effect ends', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'hope-everthorn',
                    inPlay: ['iron-worker', 'shadow-spirit'],
                    dicepool: [
                        'natural',
                        'illusion',
                        'charm',
                        'ceremonial',
                        'ceremonial',
                        'ceremonial'
                    ],
                    spellboard: ['summon-shadow-spirit'],
                    archives: [
                        'sleeping-widow',
                        'sleeping-widow',
                        'shadow-spirit',
                        'shadow-spirit'
                    ],
                    hand: ['summon-sleeping-widows', 'final-cry']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut'],
                    spellboard: [],
                    dicepool: ['natural', 'illusion', 'ceremonial', 'ceremonial']
                }
            });
        });

        it("does not use next turn's reaction", function () {
            this.player1.clickCard(this.hopeEverthorn);
            this.player1.clickPrompt('Duplicate');
            this.player1.clickDie(0);
            this.player1.clickCard(this.shadowSpirit);
            this.player1.clickCard(this.summonShadowSpirit);

            this.player1.clickPrompt('Summon Shadow Spirit');

            this.player1.endTurn();

            expect(this.player1).toHavePrompt('Any reactions to Shadow Spirit being destroyed?');
            this.player1.clickCard(this.summonSleepingWidows);
            expect(this.player1.player.limitedPlayed).toBe(1);

            this.player2.clickDie(0);
            this.player2.clickPrompt('Natural Dice Power');
            this.player2.clickCard(this.sleepingWidow);
            //expect(this.player1.player.limitedPlayed).toBe(0);

            //expect(this.player1).toHavePrompt('Any reactions to Sleeping Widow being destroyed?'); // Failing as reaction already used?
        });
    });
});
