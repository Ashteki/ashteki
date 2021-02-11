describe('Fear', function () {
    describe('Fear played', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'jessa-na-ni',
                    inPlay: ['enchanted-violinist', 'mist-spirit', 'blue-jaguar'],
                    dicepool: ['natural', 'illusion', 'charm', 'charm'],
                    hand: ['fear']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'iron-worker'],
                    spellboard: ['summon-iron-rhino', 'summon-iron-rhino', 'chant-of-revenge']
                }
            });

            this.jessaNaNi.tokens.damage = 3;
        });

        it('destroy unit and heal jessa', function () {
            this.player1.clickCard(this.fear); // play card
            this.player1.clickPrompt('Play this action');
            this.player1.clickDie(0);
            expect(this.player1).toHavePrompt('Choose a unit to destroy');
            this.player1.clickCard(this.enchantedViolinist); // destroy
            this.player1.clickPrompt('Pass'); // jessa ability pass

            expect(this.jessaNaNi.damage).toBe(2);
            expect(this.enchantedViolinist.location).toBe('discard');

            expect(this.player1).toHavePrompt('Choose a unit to discard');
            this.player1.clickCard(this.ironWorker); // discard iron worker
            expect(this.ironWorker.location).toBe('discard');
        });
    });

    describe('Fear played with no damage', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'jessa-na-ni',
                    inPlay: ['enchanted-violinist', 'mist-spirit', 'blue-jaguar'],
                    dicepool: ['natural', 'illusion', 'charm', 'charm'],
                    hand: ['fear']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'iron-worker'],
                    spellboard: ['summon-iron-rhino', 'summon-iron-rhino', 'chant-of-revenge']
                }
            });
        });

        it('destroy unit no heal jessa but still discard', function () {
            this.player1.clickCard(this.fear); // play card
            this.player1.clickPrompt('Play this action');
            this.player1.clickDie(0);
            expect(this.player1).toHavePrompt('Choose a unit to destroy');
            this.player1.clickCard(this.enchantedViolinist); // destroy
            this.player1.clickPrompt('Pass'); // jessa ability pass

            expect(this.jessaNaNi.damage).toBe(0);
            expect(this.enchantedViolinist.location).toBe('discard');

            expect(this.player1).toHavePrompt('Choose a unit to discard');
            this.player1.clickCard(this.ironWorker); // discard iron worker
            expect(this.ironWorker.location).toBe('discard');
        });
    });
});
