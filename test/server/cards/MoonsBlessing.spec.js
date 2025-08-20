describe('Moons Blessing', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['iron-worker', 'flute-mage'],
                dicepool: ['charm', 'charm', 'sympathy'],
                hand: ['reflections-in-the-water', 'moons-blessing'],
                discard: ['abundance', 'frost-fang']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['hammer-knight', 'gilder'],
                spellboard: [],
                discard: ['anchornaut', 'purge']
            }
        });
    });

    it('return ready spell from discard on play', function () {
        this.player1.play(this.moonsBlessing);
        this.player1.clickCard(this.fluteMage);
        // check other player's discard
        expect(this.player1).not.toBeAbleToSelect(this.anchornaut);
        expect(this.player1).not.toBeAbleToSelect(this.purge);
        this.player1.clickCard(this.abundance);

        expect(this.fluteMage.life).toBe(3);
        expect(this.fluteMage.recover).toBe(2);
        expect(this.abundance.location).toBe('hand');

        expect(this.player1).toHaveDefaultPrompt();
    });

    it('played on opponent unit give player choice', function () {
        this.player1.play(this.moonsBlessing);
        this.player1.clickCard(this.gilder);
        expect(this.player1).not.toBeAbleToSelect(this.anchornaut);
        expect(this.player1).not.toBeAbleToSelect(this.purge);
        expect(this.player2).not.toBeAbleToSelect(this.anchornaut);
        expect(this.player2).not.toBeAbleToSelect(this.purge);

        this.player1.clickCard(this.abundance);

        expect(this.gilder.life).toBe(3);
        expect(this.gilder.recover).toBe(1);
        expect(this.abundance.location).toBe('hand');

        expect(this.player1).toHaveDefaultPrompt();
    });
});
