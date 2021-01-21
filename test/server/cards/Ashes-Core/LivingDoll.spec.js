describe('Living Doll ability', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'jessa-na-ni',
                inPlay: ['living-doll'],
                dicepool: ['natural', 'illusion', 'charm', 'charm'],
                spellboard: [],
                hand: []
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['anchornaut'],
                spellboard: ['summon-iron-rhino'],
                dicepool: ['natural', 'illusion', 'ceremonial', 'ceremonial'],
                hand: []
            }
        });

        this.livingDoll.tokens.damage = 1;
    });

    it('ability deals damage to PB', function () {
        this.player1.clickCard(this.livingDoll);
        this.player1.clickPrompt('Pain Link');
        expect(this.coalRoarkwin.damage).toBe(1);
    });

    it('ability doesnt proc without LD damage token', function () {
        this.livingDoll.tokens.damage = 0;

        this.player1.clickCard(this.livingDoll);
        expect(this.player1).toHaveDefaultPrompt();
        expect(this.coalRoarkwin.damage).toBe(0);
    });
});
