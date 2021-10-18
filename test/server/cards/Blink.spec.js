describe('Blink action spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['mist-spirit'],
                dicepool: ['natural', 'ceremonial', 'illusion', 'charm'],
                hand: ['blink']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['iron-worker', 'mist-spirit', 'fire-archer', 'anchornaut'],
                spellboard: []
            }
        });
    });

    it('removes conjuration from play then returns at end of turn', function () {
        this.player1.play(this.blink);
        this.player1.clickDie(0);
        this.player1.clickCard(this.mistSpirit);

        expect(this.mistSpirit.location).toBe('purged');

        this.player1.endTurn();
        expect(this.mistSpirit.location).toBe('play area');
    });

    it('should allow enters play triggers', function () {
        this.player1.play(this.blink);
        this.player1.clickDie(0);
        this.player1.clickCard(this.anchornaut);

        expect(this.anchornaut.location).toBe('purged');

        this.player1.endTurn();
        expect(this.anchornaut.location).toBe('play area');
        // enters play ability
        expect(this.player2).toHavePrompt('Throw 1');
    });

    it('should allow enters play triggers - fire archer', function () {
        expect(this.coalRoarkwin.damage).toBe(0);
        this.player1.play(this.blink);
        this.player1.clickDie(0);
        this.player1.clickCard(this.fireArcher);

        expect(this.fireArcher.location).toBe('purged');

        this.player1.endTurn();
        expect(this.fireArcher.location).toBe('play area');
        // enters play ability
        expect(this.coalRoarkwin.damage).toBe(0);
        this.player2.clickCard(this.coalRoarkwin);
        expect(this.coalRoarkwin.damage).toBe(1);
    });
});
