describe('Tyranny Aspect', function () {
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
                inPlay: ['tyranny'],
                deck: [],
                spellboard: [],
                threatZone: [],
                dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                archives: ['scarlet-seed']
            }
        });
    });

    it('on attack adds 1 red rains token', function () {
        expect(this.blightOfNeverset.redRains).toBe(0);
        this.player1.endTurn();
        // chimera attacks
        expect(this.game.attackState.isPBAttack).toBe(true);

        expect(this.blightOfNeverset.redRains).toBe(1);
    });

    it('has attack equal to chimera phase', function () {
        expect(this.tyranny.attack).toBe(1);

        this.player2.player.chimeraPhase = 2;

        this.player1.endTurn();
        expect(this.tyranny.attack).toBe(2);
    });
});
