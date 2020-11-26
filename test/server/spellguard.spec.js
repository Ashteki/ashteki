describe('spell guard', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: [],
                dicepool: ['natural', 'illusion', 'charm', 'charm'],
                spellboard: ['summon-butterfly-monk'],
                hand: ['seal']
            },
            player2: {
                phoenixborn: 'maeoni-viper',
                inPlay: [],
                spellboard: ['summon-silver-snake', 'summon-silver-snake', 'chant-of-revenge']
            }
        });
    });

    it('prevents spell selection', function () {
        this.player1.clickCard(this.seal); // play seal
        this.player1.clickPrompt('Play this action');
        expect(this.player1).toHavePrompt('Choose a Ready Spell');
        expect(this.player1).toBeAbleToSelect(this.chantOfRevenge);
        // spell guard!
        expect(this.player1).not.toBeAbleToSelect(this.player2.spellboard[0]);
        expect(this.player1).not.toBeAbleToSelect(this.player2.spellboard[1]);
    });
});
