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
                        'ceremonial',
                        'charm',
                        'charm'
                    ],
                    spellboard: [],
                    hand: ['summon-sleeping-widows', 'final-cry'],
                    archives: ['sleeping-widow', 'sleeping-widow']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'mist-spirit'],
                    spellboard: [],
                    dicepool: ['natural', 'illusion', 'ceremonial', 'ceremonial']
                }
            });
        });

        it('Only allow one reaction', function () {
            this.player1.clickCard(this.brennenBlackcloud);
            this.player1.clickPrompt('Spirit Burn');
            this.player1.clickCard(this.fireArcher);
            expect(this.fireArcher.location).toBe('discard');
            this.player1.clickCard(this.coalRoarkwin);
            expect(this.player1).toHavePrompt('Any reactions to Fire Archer leaving play?');
            this.player1.clickCard(this.summonSleepingWidows);
            expect(this.player1).toBeAbleToSelect(this.player1.archives[0]);
            expect(this.player1).toBeAbleToSelect(this.player1.archives[1]);
            this.player1.clickCard(this.player1.archives[0]);
            this.player1.clickCard(this.player1.archives[1]);
            this.player1.clickPrompt('Done');
            expect(this.player1.inPlay.length).toBe(2);
            expect(this.player1.discard.length).toBe(2); // summonSleepingWidows and fire archer
            expect(this.player1).not.toHavePrompt('Any reactions to Fire Archer leaving play?');
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
            expect(this.player1).toHavePrompt('Any reactions to blood puppet leaving play?');
            expect(this.player2).not.toHavePrompt('Any reactions to blood puppet leaving play?');

            this.player1.clickCard(this.summonSleepingWidows);
            expect(this.player1).toBeAbleToSelect(this.player1.archives[0]);
            expect(this.player1).toBeAbleToSelect(this.player1.archives[1]);
            this.player1.clickCard(this.player1.archives[0]);
            this.player1.clickCard(this.player1.archives[1]);
            this.player1.clickPrompt('Done');

            expect(this.player2).toHavePrompt('Any reactions to blood puppet leaving play?');
            this.player2.clickCard(this.jessaNaNi);
            this.player2.clickDie(1);

            expect(this.coalRoarkwin.damage).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
