describe('Blood Transfer ability', function () {
    describe('normal test', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'jessa-na-ni',
                    dicepool: ['natural', 'ceremonial', 'charm', 'charm'],
                    hand: [],
                    spellboard: ['chant-of-revenge', 'blood-transfer'],
                    inPlay: ['blood-shaman', 'iron-worker', 'hammer-knight']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit', 'stormwind-sniper', 'holy-knight'],
                    spellboard: ['empower', 'summon-mist-spirit'],
                    dicepool: ['illusion'],
                    hand: ['vanish']
                }
            });
        });

        it('bug: damage blood shaman to heal 1 pb damage', function () {
            this.jessaNaNi.tokens.damage = 4;
            expect(this.jessaNaNi.damage).toBe(4);

            this.player1.useCardAbility(this.bloodTransfer, 'Blood Transfer');
            this.player1.clickCard(this.bloodShaman);
            this.player1.clickPrompt('None'); // screams reaction
            this.player1.clickCard(this.jessaNaNi);

            expect(this.bloodShaman.location).toBe('discard');
            expect(this.jessaNaNi.damage).toBe(2); // one from blood shaman, one from blood transfer

            expect(this.player1).toHaveDefaultPrompt();
        });

        it('damage unit to heal 1 pb damage', function () {
            this.jessaNaNi.tokens.damage = 4;
            expect(this.jessaNaNi.damage).toBe(4);

            this.player1.useCardAbility(this.bloodTransfer, 'Blood Transfer');
            this.player1.clickCard(this.ironWorker);
            this.player1.clickPrompt('None'); // screams reaction
            this.player1.clickCard(this.jessaNaNi);

            expect(this.ironWorker.location).toBe('discard');
            expect(this.jessaNaNi.damage).toBe(3);

            expect(this.player1).toHaveDefaultPrompt();
        });

        it('damage unit to heal 2 unit damage', function () {
            this.hammerKnight.tokens.damage = 2;
            expect(this.hammerKnight.damage).toBe(2);

            this.player1.useCardAbility(this.bloodTransfer, 'Blood Transfer');
            this.player1.clickCard(this.ironWorker);
            this.player1.clickPrompt('None'); // screams reaction
            this.player1.clickCard(this.hammerKnight);

            expect(this.ironWorker.location).toBe('discard');
            expect(this.hammerKnight.damage).toBe(0); // heal 2 from blood transfer

            expect(this.player1).toHaveDefaultPrompt();
        });

        it('no unit target means no heal', function () {
            this.hammerKnight.tokens.damage = 2;
            expect(this.hammerKnight.damage).toBe(2);

            this.player1.useCardAbility(this.bloodTransfer, 'Blood Transfer');
            this.player1.clickCancel();

            expect(this.ironWorker.location).toBe('play area');
            expect(this.hammerKnight.damage).toBe(2); // no heal since no unit was targeted

            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
