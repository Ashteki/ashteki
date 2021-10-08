describe('Transfer actions spell', function () {
    describe('normal test', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker'],
                    dicepool: ['natural', 'ceremonial', 'charm', 'charm'],
                    hand: ['transfer'],
                    spellboard: ['chant-of-revenge']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit', 'stormwind-sniper', 'holy-knight'],
                    spellboard: ['empower', 'summon-mist-spirit'],
                    dicepool: ['illusion'],
                    hand: ['vanish']
                }
            });
            this.ironWorker.tokens.status = 2;
            this.blueJaguar.tokens.exhaustion = 1;
            this.ironWorker.tokens.exhaustion = 1;
            this.chantOfRevenge.tokens.exhaustion = 1;
            this.summonMistSpirit.tokens.exhaustion = 1;
        });

        it('should move 1 chosen token type between my cards', function () {
            expect(this.ironWorker.tokens.status).toBe(2);
            expect(this.chantOfRevenge.tokens.status).toBeUndefined();

            this.player1.clickCard(this.transfer);
            this.player1.clickPrompt('Play this action');
            this.player1.clickDie(0);
            this.player1.clickPrompt('Done');
            expect(this.player1).toBeAbleToSelect(this.chantOfRevenge); // mine
            expect(this.player1).toBeAbleToSelect(this.summonMistSpirit); // other player
            expect(this.player1).not.toBeAbleToSelect(this.empower); // no tokens
            expect(this.player1).toHavePrompt('Choose a card with tokens');

            this.player1.clickCard(this.ironWorker);
            expect(this.player1).toHavePrompt('Choose a type');
            expect(this.player1).toHavePromptButton('Exhaustion');
            expect(this.player1).toHavePromptButton('Status');

            this.player1.clickPrompt('Status');
            expect(this.player1).not.toBeAbleToSelect(this.empower); // needs same player controlling target
            expect(this.player1).toHavePrompt('Choose a card to receive the token');

            this.player1.clickCard(this.chantOfRevenge);
            expect(this.ironWorker.tokens.status).toBe(1);
            expect(this.chantOfRevenge.tokens.status).toBe(1);
        });

        it('can move 1 chosen token to an enemy concealed unit - triggers vanish', function () {
            expect(this.blueJaguar.exhausted).toBe(true);
            expect(this.stormwindSniper.exhausted).toBe(false);

            this.player1.clickCard(this.transfer);
            this.player1.clickPrompt('Play this action');
            this.player1.clickDie(0);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.blueJaguar);

            this.player1.clickPrompt('Exhaustion');

            this.player1.clickCard(this.stormwindSniper);

            this.player2.clickPass();

            expect(this.blueJaguar.exhausted).toBe(false);
            expect(this.stormwindSniper.exhausted).toBe(true);
        });

        it('can move 1 chosen token to a unit with magic armour', function () {
            expect(this.blueJaguar.exhausted).toBe(true);
            expect(this.holyKnight.exhausted).toBe(false);

            this.player1.clickCard(this.transfer);
            this.player1.clickPrompt('Play this action');
            this.player1.clickDie(0);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.blueJaguar);

            this.player1.clickPrompt('Exhaustion');

            this.player1.clickCard(this.holyKnight);

            this.player2.clickPass();

            expect(this.blueJaguar.exhausted).toBe(false);
            expect(this.holyKnight.exhausted).toBe(true);
        });
    });

    describe('interactions', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker'],
                    dicepool: ['natural', 'ceremonial', 'charm', 'charm'],
                    hand: ['transfer'],
                    spellboard: ['chant-of-revenge']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    spellboard: ['empower', 'summon-mist-spirit'],
                    hand: ['golden-veil'],
                    dicepool: ['charm']
                }
            });
            this.blueJaguar.tokens.status = 2;
            this.ironWorker.tokens.exhaustion = 1;
            this.chantOfRevenge.tokens.exhaustion = 1;
            this.summonMistSpirit.tokens.exhaustion = 1;
        });

        it('does not interact with golden veil', function () {
            expect(this.blueJaguar.status).toBe(2);
            expect(this.mistSpirit.status).toBe(0);

            this.player1.clickCard(this.transfer);
            this.player1.clickPrompt('Play this action');
            this.player1.clickDie(0);
            this.player1.clickPrompt('Done');

            this.player1.clickCard(this.blueJaguar);
            this.player1.clickPrompt('Status');

            this.player1.clickCard(this.mistSpirit);
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.blueJaguar.status).toBe(1);
            expect(this.mistSpirit.status).toBe(1);
        });
    });
});
