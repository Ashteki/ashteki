const { Level } = require('../../../server/constants');
describe(' River Colossus', function () {
    describe(' Rouse 2 ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['river-colossus', 'iron-worker'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'time', 'charm'],
                    hand: ['molten-gold'],
                    archives: ['spark']
                },
                player2: {
                    phoenixborn: 'saria-guideman',
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['sympathy-pain'],
                    inPlay: ['flute-mage', 'mist-spirit'],
                    spellboard: ['keepsake']
                }
            });
        });

        it('on RC attack may lower 2 dice to add 2 to attack', function () {
            this.player1.clickAttack(this.fluteMage);
            this.player1.clickCard(this.riverColossus);
            this.player1.clickCard(this.riverColossus);

            this.player1.clickDie(0);
            this.player1.clickDie(1);

            this.player1.clickDone();
            expect(this.player1.dicepool[0].level).toBe(Level.Class);
            expect(this.player1.dicepool[1].level).toBe(Level.Class);
            expect(this.riverColossus.attack).toBe(4);
        });

        it('on RC attack try to lower 1 die, fails', function () {
            this.player1.clickAttack(this.fluteMage);
            this.player1.clickCard(this.riverColossus);
            this.player1.clickCard(this.riverColossus); // reaction

            this.player1.clickDie(0);

            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickCancel();
            expect(this.player1.dicepool[0].level).toBe(Level.Power);
            expect(this.player1.dicepool[1].level).toBe(Level.Power);
            expect(this.riverColossus.attack).toBe(2);
            expect(this.player1).toHavePrompt('Waiting for opponent to guard');
        });

        it('on RC attack with only 2 dice to lower triggers ok', function () {
            this.player1.dicepool[0].level = Level.Basic;
            this.player1.dicepool[1].level = Level.Basic;
            this.player1.dicepool[2].level = Level.Class;
            this.player1.dicepool[3].level = Level.Class;
            this.player1.clickAttack(this.fluteMage);
            this.player1.clickCard(this.riverColossus);
            this.player1.clickCard(this.riverColossus);

            this.player1.clickDie(2);
            this.player1.clickDie(3);

            this.player1.clickDone();
            expect(this.riverColossus.attack).toBe(4);
        });

        it('on RC attack with only 1 dice to lower does not trigger', function () {
            this.player1.dicepool[0].level = Level.Basic;
            this.player1.dicepool[1].level = Level.Basic;
            this.player1.dicepool[2].level = Level.Basic;
            this.player1.dicepool[3].level = Level.Class;
            this.player1.clickAttack(this.fluteMage);
            this.player1.clickCard(this.riverColossus);
            expect(this.riverColossus.attack).toBe(2);
            expect(this.player1).toHavePrompt('Waiting for opponent to guard');
        });
    });
});
