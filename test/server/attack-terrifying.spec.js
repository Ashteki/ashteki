describe('Terrifying attacks', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['frostback-bear', 'mist-spirit']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['anchornaut', 'iron-worker'],
                spellboard: [],
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                hand: ['anchornaut']
            }
        });
    });

    it('defender blocker choice is limited by Terrifying 1', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.coalRoarkwin); // target
        this.player1.clickCard(this.frostbackBear); // single attacker
        this.player1.clickPrompt('Done');

        expect(this.player2).toHavePrompt('Choose a blocker');
        expect(this.player2).toBeAbleToSelect(this.ironWorker);
        expect(this.player2).not.toBeAbleToSelect(this.anchornaut);
    });
});
