describe('Sword of Virtue action spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'odette-diamondcrest',
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
        this.odetteDiamondcrest.tokens.damage = 5;
    });

    it('should remove all wounds', function () {
        expect(this.odetteDiamondcrest.damage).toBe(5);
        this.player1.clickCard(this.swordOfVirtue);
        this.player1.clickPrompt('Play this action');
        this.player1.clickDie(2);
        this.player1.clickDie(3);
        this.player1.clickPrompt('Done');
        expect(this.player1).not.toBeAbleToSelect(this.odetteDiamondcrest);
        this.player1.clickCard(this.odetteDiamondcrest);
        this.player1.clickCard(this.ironRhino);
        expect(this.player1).toHavePromptButton('Destroy');
        expect(this.player1).toHavePromptButton('Remove tokens');
        this.player1.clickPrompt('Remove tokens');

        expect(this.ironRhino.damage).toBe(0);
        expect(this.odetteDiamondcrest.damage).toBe(5);
    });

    it('should destroy a unit', function () {
        this.player1.clickCard(this.swordOfVirtue);
        this.player1.clickPrompt('Play this action');
        this.player1.clickDie(2);
        this.player1.clickDie(3);
        this.player1.clickPrompt('Done');
        expect(this.player1).not.toBeAbleToSelect(this.coalRoarkwin);
        this.player1.clickCard(this.anchornaut);
        this.player1.clickPrompt('Destroy');
        expect(this.anchornaut.location).toBe('discard');
    });
});
