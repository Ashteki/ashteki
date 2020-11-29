describe('Stormwind Sniper', function () {
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

    it('is concealed from unit attacks', function () {
        this.player1.clickPrompt('Attack');
        expect(this.player1).toHavePrompt('Select a target to attack');
        // concealed!
        expect(this.player1).toBeAbleToSelect(this.ironWorker);
        expect(this.player1).not.toBeAbleToSelect(this.stormwindSniper);
    });
});
