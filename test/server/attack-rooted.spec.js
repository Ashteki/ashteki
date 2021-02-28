describe('rooted - biter', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['biter', 'mist-spirit'],
                spellboard: ['hypnotize'],
                dicepool: ['natural', 'natural', 'charm', 'charm']
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

    it('prevents attack with that unit', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.coalRoarkwin); // target
        expect(this.player1).not.toBeAbleToSelect(this.biter);
        expect(this.player1).toBeAbleToSelect(this.mistSpirit);
        this.player1.clickCard(this.mistSpirit);
        this.player1.clickPrompt('Done'); // single attacker
        expect(this.player2).toHavePrompt('Choose a blocker');
    });
});
