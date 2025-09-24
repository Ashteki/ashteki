describe('Summon Tusk Mount', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'brennen-blackcloud',
                archives: ['tusk-mount'],
                spellboard: ['summon-tusk-mount'],
                hand: ['power-through'],
                dicepool: ['time', 'natural', 'natural', 'time'],
                inPlay: ['anchornaut']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['flute-mage', 'hammer-knight']
            }
        });
    });

    it('Summon action', function () {
        this.player1.clickCard(this.summonTuskMount);
        this.player1.clickPrompt('Summon Tusk Mount');
        this.player1.clickDie(1);
        this.player1.clickDie(2);
        this.player1.clickDone();
        this.player1.clickCard(this.anchornaut);

        expect(this.tuskMount.location).toBe('play area');
        expect(this.anchornaut.location).toBe('purged');
        expect(this.anchornaut.facedown).toBe(true);
        expect(this.tuskMount.childCards.length).toBe(1);
    });
});
