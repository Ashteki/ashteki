describe('Stormwind Sniper', function () {
    describe('Concealed', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['mist-spirit'],
                    dicepool: ['natural', 'natural', 'illusion', 'charm', 'charm'],
                    spellboard: ['summon-butterfly-monk'],
                    hand: ['molten-gold']
                },
                player2: {
                    phoenixborn: 'maeoni-viper',
                    inPlay: ['stormwind-sniper', 'iron-worker'],
                    spellboard: []
                }
            });
        });

        it('is concealed from spell targetting', function () {
            this.player1.clickCard(this.moltenGold); // play seal
            this.player1.clickPrompt('Play this action');
            expect(this.player1).toHavePrompt('Choose a card');
            // concealed!
            expect(this.player1).toBeAbleToSelect(this.ironWorker);
            expect(this.player1).not.toBeAbleToSelect(this.stormwindSniper);
        });

        it('is not concealed from spell targetting when exhausted', function () {
            exhaustCard(this.stormwindSniper, this.game);

            this.player1.clickCard(this.moltenGold); // play seal
            this.player1.clickPrompt('Play this action');
            expect(this.player1).toHavePrompt('Choose a card');
            // concealed!
            expect(this.player1).toBeAbleToSelect(this.ironWorker);
            expect(this.player1).toBeAbleToSelect(this.stormwindSniper);
        });

        it('is concealed from unit attacks', function () {
            this.player1.clickPrompt('Attack');
            expect(this.player1).toHavePrompt('Select a target to attack');
            // concealed!
            expect(this.player1).toBeAbleToSelect(this.ironWorker);
            expect(this.player1).not.toBeAbleToSelect(this.stormwindSniper);
        });

        it('is not concealed from unit attacks when exhausted', function () {
            exhaustCard(this.stormwindSniper, this.game);

            this.player1.clickPrompt('Attack');
            expect(this.player1).toHavePrompt('Select a target to attack');
            // concealed!
            expect(this.player1).toBeAbleToSelect(this.ironWorker);
            expect(this.player1).toBeAbleToSelect(this.stormwindSniper);
        });

        it('is concealed from PB abilities', function () {
            this.player1.clickCard(this.aradelSummergaard);
            this.player1.clickPrompt('Water Blast');

            expect(this.player1).not.toBeAbleToSelect(this.stormwindSniper);
        });

        it('is not concealed from PB abilities when exhausted', function () {
            exhaustCard(this.stormwindSniper, this.game);
            this.player1.clickCard(this.aradelSummergaard);
            this.player1.clickPrompt('Water Blast');

            expect(this.player1).toBeAbleToSelect(this.stormwindSniper);
        });

        function exhaustCard(card, game) {
            game.actions.exhaust().resolve(card, game.getFrameworkContext());
        }
    });

    describe('Attacking', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['stormwind-sniper'],
                    dicepool: ['natural', 'natural', 'illusion', 'charm', 'charm'],
                    spellboard: ['summon-butterfly-monk'],
                    hand: ['molten-gold']
                },
                player2: {
                    phoenixborn: 'maeoni-viper',
                    inPlay: ['hammer-knight', 'iron-worker'],
                    spellboard: []
                }
            });
        });

        it('BUG: sniper attack value is 2, no pb damage', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.stormwindSniper);
            this.player2.clickPrompt('Done'); // guard
            this.player2.clickPrompt('No'); // counter

            // bug check for damage
            expect(this.hammerKnight.damage).toBe(2);
            expect(this.maeoniViper.damage).toBe(0);
        });
    });
});
