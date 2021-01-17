describe('Empower', function () {
    describe('unfocused', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker'],
                    dicepool: ['natural', 'ceremonial', 'charm', 'charm'],
                    hand: [],
                    spellboard: ['empower']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    spellboard: ['summon-butterfly-monk']
                }
            });
        });

        it('adds a token to one unit', function () {
            expect(this.ironWorker.tokens.status).toBeUndefined();

            this.player1.clickCard(this.empower);
            this.player1.clickPrompt('Empower');
            this.player1.clickDie(0);
            expect(this.player1).toHavePrompt('Choose a unit to empower');
            this.player1.clickCard(this.ironWorker);

            expect(this.ironWorker.status).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play or use');
        });
    });

    describe('focus 1', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker'],
                    dicepool: ['natural', 'ceremonial', 'charm', 'charm'],
                    spellboard: ['empower', 'empower']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['iron-rhino']
                }
            });
        });

        it('deals 1 damage to a unit', function () {
            expect(this.ironWorker.tokens.status).toBeUndefined();

            this.player1.clickCard(this.empower);
            this.player1.clickPrompt('Empower');
            this.player1.clickDie(0);
            expect(this.player1).toHavePrompt('Choose a unit to empower');
            this.player1.clickCard(this.ironWorker);

            expect(this.ironWorker.status).toBe(1);
            expect(this.player1).toHavePrompt('Choose a unit with status tokens');
            this.player1.clickCard(this.ironWorker);

            expect(this.player1).toHavePrompt('how many tokens?');
            this.player1.clickPrompt('1');

            expect(this.player1).toHavePrompt('Choose a unit to damage');
            this.player1.clickCard(this.ironRhino);

            expect(this.ironWorker.status).toBe(0);
            expect(this.ironRhino.damage).toBe(1);
        });

        it('deals 2 damage to a unit', function () {
            this.ironWorker.tokens.status = 2;

            this.player1.clickCard(this.empower);
            this.player1.clickPrompt('Empower');
            this.player1.clickDie(0);
            expect(this.player1).toHavePrompt('Choose a unit to empower');
            this.player1.clickCard(this.ironWorker);

            expect(this.ironWorker.status).toBe(3);
            expect(this.player1).toHavePrompt('Choose a unit with status tokens');
            this.player1.clickCard(this.ironWorker);

            expect(this.player1).toHavePrompt('how many tokens?');
            this.player1.clickPrompt('2');

            expect(this.player1).toHavePrompt('Choose a unit to damage');
            this.player1.clickCard(this.ironRhino);

            expect(this.ironWorker.status).toBe(1);
            expect(this.ironRhino.damage).toBe(2);
        });

        it('focus ability is cancelable', function () {
            this.player1.clickCard(this.empower);
            this.player1.clickPrompt('Empower');
            this.player1.clickDie(0);
            expect(this.player1).toHavePrompt('Choose a unit to empower');
            this.player1.clickCard(this.ironWorker);

            expect(this.ironWorker.status).toBe(1);
            expect(this.player1).toHavePrompt('Choose a unit with status tokens');
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to play or use');
        });

        it('ability bails if 0 tokens removed', function () {
            this.player1.clickCard(this.empower);
            this.player1.clickPrompt('Empower');
            this.player1.clickDie(0);
            expect(this.player1).toHavePrompt('Choose a unit to empower');
            this.player1.clickCard(this.ironWorker);

            expect(this.ironWorker.status).toBe(1);
            expect(this.player1).toHavePrompt('Choose a unit with status tokens');
            this.player1.clickCard(this.ironWorker);

            expect(this.player1).toHavePrompt('how many tokens?');
            this.player1.clickPrompt('0');

            expect(this.player1).toHavePrompt('Choose a card to play or use');
        });
    });
});
