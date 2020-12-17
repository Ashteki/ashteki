describe('Rin Northfell ability', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'rin-northfell',
                inPlay: ['mist-spirit'],
                dicepool: ['natural', 'natural', 'natural', 'charm'],
                spellboard: [],
                archives: ['ice-buff']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['iron-worker']
            }
        });
    });

    it('attaches to target card', function () {
        this.player1.clickCard(this.rinNorthfell); // play ability
        this.player1.clickPrompt('Ice Buff');
        this.player1.clickCard(this.mistSpirit); // attach to ms
        this.player1.clickCard(this.iceBuff); // pick ice buff

        expect(this.mistSpirit.life).toBe(2);
    });
});
