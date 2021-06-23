describe('Empower', function () {
    describe('In play', function () {
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

            expect(this.ironWorker.tokens.status).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play or use');
        });
    });

    describe('Focus ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker'],
                    dicepool: ['natural', 'ceremonial', 'charm', 'charm'],
                    hand: [],
                    spellboard: ['empower', 'empower']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['hammer-knight', 'mist-spirit'],
                    spellboard: ['summon-butterfly-monk'],
                    dicepool: ['charm'],
                    hand: ['golden-veil']
                }
            });
        });

        it('remove a token to deal damage', function () {
            this.ironWorker.tokens.status = 2;

            this.player1.clickCard(this.empower);
            this.player1.clickPrompt('Empower');
            this.player1.clickDie(0);
            this.player1.clickCard(this.ironWorker);
            expect(this.ironWorker.tokens.status).toBe(3);
            this.player1.clickCard(this.ironWorker);
            this.player1.clickPrompt(2);
            this.player1.clickCard(this.hammerKnight);
            this.player2.clickPass(); // GV
            expect(this.ironWorker.status).toBe(1);
            expect(this.hammerKnight.damage).toBe(2);

            expect(this.player1).toHavePrompt('Choose a card to play or use');
        });

        it('golden veil prevents damage, status tokens spent', function () {
            this.ironWorker.tokens.status = 2;

            this.player1.clickCard(this.empower);
            this.player1.clickPrompt('Empower');
            this.player1.clickDie(0);
            this.player1.clickCard(this.ironWorker);
            expect(this.ironWorker.tokens.status).toBe(3);
            this.player1.clickCard(this.ironWorker);
            this.player1.clickPrompt(2);
            this.player1.clickCard(this.hammerKnight);
            this.player2.clickCard(this.goldenVeil);

            expect(this.ironWorker.status).toBe(1);
            expect(this.hammerKnight.damage).toBe(0);

            expect(this.player1).toHavePrompt('Choose a card to play or use');
        });
    });
});
