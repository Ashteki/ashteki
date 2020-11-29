describe('Gigantic attacks', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['iron-rhino', 'mist-spirit'],
                spellboard: ['summon-butterfly-monk']
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

    it('defender blocker choice is limited by Gigantic 1', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.coalRoarkwin); // target
        this.player1.clickCard(this.ironRhino); // single attacker
        this.player1.clickPrompt('Done');

        expect(this.player2).toHavePrompt('Choose a blocker');
        expect(this.player2).toBeAbleToSelect(this.ironWorker);
        expect(this.player2).not.toBeAbleToSelect(this.anchornaut);
    });
});
