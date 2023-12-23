describe('Firebelly', function () {
    beforeEach(function () {
        this.setupTest({
            mode: 'solo',
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['anchornaut', 'flute-mage'], // 2 defenders to prevent ping removal - breaks for expect below.
                spellboard: [],
                dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                hand: ['summon-iron-rhino']
            },
            player2: {
                dummy: true,
                phoenixborn: 'blight-of-neverset',
                behaviour: 'neverset-behaviour',
                ultimate: 'neverset-ultimate',
                inPlay: ['sowing-strike'],
                deck: [],
                spellboard: [],
                threatZone: [],
                dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                archives: ['scarlet-seed']
            }
        });

    });

    it('on attack places scarlet seed into play', function () {
        expect(this.scarletSeed.location).toBe('archives');
        this.player1.endTurn();
        // chimera attacks
        expect(this.game.attackState.isPBAttack).toBe(true);
        expect(this.scarletSeed.location).toBe('play area');
    });
});
