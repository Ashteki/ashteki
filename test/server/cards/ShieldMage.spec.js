describe('Shield Mage', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['mist-spirit', 'anchornaut'],
                dicepool: ['divine', 'illusion', 'charm', 'charm'],
                spellboard: [],
                hand: ['close-combat', 'power-through']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['iron-worker', 'shield-mage'],
                spellboard: ['summon-iron-rhino'],
                hand: ['molten-gold'],
                dicepool: ['natural', 'natural', 'charm', 'charm']
            }
        });
    });

    it('cannot be targetted for attack', function () {
        this.player1.clickPrompt('Attack');
        expect(this.player1).not.toBeAbleToSelect(this.ironWorker);
        expect(this.player1).not.toBeAbleToSelect(this.shieldMage);
        expect(this.player1).toBeAbleToSelect(this.coalRoarkwin);
    });

    it('can be targetted for attack if exhausted', function () {
        this.shieldMage.tokens.exhaustion = 1;
        this.player1.clickPrompt('Attack');
        expect(this.player1).not.toBeAbleToSelect(this.ironWorker);
        expect(this.player1).not.toBeAbleToSelect(this.shieldMage);
        expect(this.player1).toBeAbleToSelect(this.coalRoarkwin);
    });
});
