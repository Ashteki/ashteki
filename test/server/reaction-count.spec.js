describe('Reactions', function () {
    describe('Reaction Count', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'brennen-blackcloud',
                    inPlay: ['fire-archer'],
                    dicepool: [
                        'ceremonial',
                        'ceremonial',
                        'ceremonial',
                        'ceremonial',
                        'illusion',
                        'charm',
                        'charm'
                    ],
                    spellboard: [],
                    hand: ['summon-sleeping-widows', 'final-cry'],
                    archives: ['sleeping-widow', 'sleeping-widow']
                },
                player2: {
                    phoenixborn: 'jessa-na-ni',
                    inPlay: ['anchornaut', 'mist-spirit'],
                    spellboard: [],
                    dicepool: [
                        'charm',
                        'charm',
                        'illusion',
                        'ceremonial',
                        'ceremonial',
                        'natural',
                        'natural'
                    ],
                    hand: ['molten-gold']
                }
            });
        });

        it('Only allow one reaction', function () {
            this.player1.clickCard(this.brennenBlackcloud);
            this.player1.clickPrompt('Spirit Burn');
            this.player1.clickCard(this.fireArcher);
            expect(this.fireArcher.location).toBe('discard');

            this.player1.clickCard(this.jessaNaNi);
            expect(this.player1).toHavePrompt('Any reactions to Fire Archer being destroyed?');

            this.player1.clickCard(this.summonSleepingWidows);
            expect(this.player1.inPlay.length).toBe(2);
            expect(this.player1.discard.length).toBe(2); // summonSleepingWidows and fire archer
            expect(this.player1).not.toHavePrompt('Any reactions to Fire Archer being destroyed?');
            expect(this.player2).toHavePrompt('Any reactions to Fire Archer being destroyed?'); // jessa reaction

            this.player2.clickPrompt('Pass');
        });

        it('reaction count resets each turn', function () {
            this.player1.clickCard(this.brennenBlackcloud);
            this.player1.clickPrompt('Spirit Burn');
            this.player1.clickCard(this.fireArcher);
            this.player1.clickCard(this.jessaNaNi);
            expect(this.player1).toHavePrompt('Any reactions to Fire Archer being destroyed?');

            this.player1.clickCard(this.summonSleepingWidows);

            expect(this.player1).not.toHavePrompt('Any reactions to Fire Archer being destroyed?');
            expect(this.player2).toHavePrompt('Any reactions to Fire Archer being destroyed?'); // jessa reaction

            this.player2.clickPrompt('Pass');
            this.player1.clickCard(this.jessaNaNi);
            this.player1.endTurn();
            this.player2.clickCard(this.moltenGold);
            this.player2.clickPrompt('Play this action');
            this.player2.clickCard(this.sleepingWidow);
            expect(this.player2).toHavePrompt('Any reactions to Sleeping Widow being destroyed?');

            this.player2.clickPrompt('Pass');
            expect(this.player1).toHavePrompt('Any reactions to Sleeping Widow being destroyed?');
        });
    });

    describe('Bug report 194: No reaction for me to death of blood puppet after jessa screamed', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-rhino', 'blood-puppet'],
                    dicepool: [
                        'ceremonial',
                        'ceremonial',
                        'ceremonial',
                        'ceremonial',
                        'ceremonial',
                        'charm',
                        'charm'
                    ],
                    spellboard: [],
                    hand: ['summon-sleeping-widows', 'final-cry'],
                    archives: ['sleeping-widow', 'sleeping-widow']
                },
                player2: {
                    phoenixborn: 'jessa-na-ni',
                    inPlay: ['anchornaut', 'mist-spirit'],
                    spellboard: [],
                    dicepool: ['natural', 'illusion', 'ceremonial', 'ceremonial']
                }
            });
            this.bloodPuppet.tokens.damage = 1;
        });

        // this may have been fixed by the recent blood puppet fix
        it('should give reaction prompt to the controlling player then opponent', function () {
            this.player1.clickCard(this.bloodPuppet);
            this.player1.clickPrompt('Self Inflict');
            this.player1.clickDie(0);
            expect(this.bloodPuppet.location).toBe('archives');
            expect(this.player1).toHavePrompt('Any reactions to blood puppet being destroyed?');
            expect(this.player2).not.toHavePrompt('Any reactions to blood puppet being destroyed?');

            this.player1.clickCard(this.summonSleepingWidows);

            expect(this.player2).toHavePrompt('Any reactions to blood puppet being destroyed?');
            this.player2.clickCard(this.jessaNaNi);
            this.player2.clickDie(1);

            expect(this.coalRoarkwin.damage).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('Reaction Count', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'brennen-blackcloud',
                    inPlay: ['iron-worker'],
                    dicepool: [
                        'natural',
                        'ceremonial',
                        'ceremonial',
                        'ceremonial',
                        'ceremonial',
                        'charm',
                        'charm'
                    ],
                    spellboard: [],
                    hand: ['summon-sleeping-widows', 'final-cry', 'fire-archer', 'ice-trap'],
                    archives: ['sleeping-widow', 'sleeping-widow']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['anchornaut', 'mist-spirit'],
                    spellboard: [],
                    dicepool: ['natural', 'charm', 'illusion', 'ceremonial', 'ceremonial'],
                    hand: ['ice-trap']
                }
            });
        });

        it('Allow one reaction spell per player', function () {
            this.player1.clickCard(this.fireArcher);
            this.player1.clickPrompt('Play this Ally');
            expect(this.player1).toHavePrompt('Any reactions to Fire Archer being played?');
            expect(this.player1).toBeAbleToSelect(this.iceTrap);

            this.player1.clickPrompt('Pass');
            expect(this.player2).toHavePrompt('Any reactions to Fire Archer being played?');

            // player2 uses reaction spell
            this.player2.clickCard('ice-trap');
            expect(this.fireArcher.location).toBe('discard');
            expect(this.player1).toHavePrompt('Any reactions to Fire Archer being destroyed?');

            this.player1.clickPrompt('Pass');
            this.player1.clickCard(this.brennenBlackcloud);
            this.player1.clickPrompt('Spirit Burn');
            this.player1.clickCard(this.ironWorker);
            expect(this.ironWorker.location).toBe('discard');
            // player1 has not used a reaction spell, so is asked for reaction
            expect(this.player1).toHavePrompt('Any reactions to Iron Worker being destroyed?');
            this.player1.clickPrompt('Pass');
            // player 2 should not be prompted because they reacted already this turn
            expect(this.player2).not.toHavePrompt('Any reactions to Iron Worker being destroyed?');
        });
    });
});
