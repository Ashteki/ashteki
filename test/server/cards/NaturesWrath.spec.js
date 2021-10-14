describe('Natures Wrath', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'lulu-firststone',
                inPlay: ['hammer-knight', 'iron-worker'],
                spellboard: [],
                dicepool: ['natural', 'natural', 'time', 'charm'],
                hand: ['natures-wrath'],
                archives: ['spark']
            },
            player2: {
                phoenixborn: 'rin-northfell',
                dicepool: ['natural', 'natural', 'ceremonial', 'charm'],
                hand: ['sympathy-pain', 'final-cry'],
                inPlay: ['mist-spirit', 'anchornaut']
            }
        });
    });

    it('deals damage to every unit', function () {
        this.player1.play(this.naturesWrath);
        this.player2.clickPass();
        expect(this.hammerKnight.location).toBe('play area');
        expect(this.anchornaut.location).toBe('discard');
        expect(this.ironWorker.location).toBe('play area');
        expect(this.mistSpirit.location).toBe('archives');
        expect(this.player1).toHaveDefaultPrompt();
    });
});
