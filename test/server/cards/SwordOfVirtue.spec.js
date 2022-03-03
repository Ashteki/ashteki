describe('Sword of Virtue action spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['iron-rhino', 'iron-worker'],
                dicepool: ['natural', 'natural', 'divine', 'divine', 'charm'],
                spellboard: [],
                hand: ['sword-of-virtue']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['anchornaut'],
                dicepool: ['natural', 'natural', 'charm', 'charm']
            }
        });

        this.ironRhino.tokens.damage = 2;
    });

    it('should remove all wounds', function () {
        this.player1.clickCard(this.swordOfVirtue);
        this.player1.clickPrompt('Play this action');
        this.player1.clickDie(2);
        this.player1.clickDie(3);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.ironRhino);
        expect(this.player1).toHavePromptButton('Destroy');
        expect(this.player1).toHavePromptButton('Remove tokens');
        this.player1.clickPrompt('Remove tokens');

        expect(this.ironRhino.damage).toBe(0);
    });

    it('should destroy a unit', function () {
        this.player1.clickCard(this.swordOfVirtue);
        this.player1.clickPrompt('Play this action');
        this.player1.clickDie(2);
        this.player1.clickDie(3);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.anchornaut);
        this.player1.clickPrompt('Destroy');
        expect(this.anchornaut.location).toBe('discard');
    });
});
