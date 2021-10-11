describe('Summon Cerasaurus Mount', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'brennen-blackcloud',
                archives: ['cerasaurus-mount'],
                spellboard: ['summon-cerasaurus-mount'],
                hand: ['power-through'],
                dicepool: ['divine', 'natural', 'time'],
                inPlay: ['anchornaut']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['flute-mage', 'hammer-knight']
            }
        });
    });

    it('Summon action', function () {
        this.player1.clickCard(this.summonCerasaurusMount);
        this.player1.clickPrompt('Summon Cerasaurus Mount');
        this.player1.clickDie(2);
        this.player1.clickCard(this.anchornaut);

        expect(this.cerasaurusMount.location).toBe('play area');
        expect(this.anchornaut.location).toBe('purged');
        expect(this.anchornaut.facedown).toBe(true);
        expect(this.cerasaurusMount.childCards.length).toBe(1);
    });
});
