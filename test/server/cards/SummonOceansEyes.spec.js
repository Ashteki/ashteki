describe("Summon Ocean's Eyes", function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'brennen-blackcloud',
                archives: ['oceans-eye', 'oceans-eye', 'oceans-eye'],
                spellboard: ['summon-oceans-eyes'],
                hand: ['power-through'],
                dicepool: ['time', 'natural', 'natural', 'time'],
                inPlay: []
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['flute-mage', 'hammer-knight']
            }
        });
    });

    it('Summon action', function () {
        this.player1.clickCard(this.summonOceansEyes);
        this.player1.clickPrompt("Summon Ocean's Eyes");
        this.player1.clickDie(1);
        this.player1.clickDie(2);
        this.player1.clickDone();

        expect(this.player1.inPlay.length).toBe(2);
        expect(this.player1.archives.length).toBe(1);
    });
});
