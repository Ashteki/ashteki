describe('Cerasaurus Mount', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'brennen-blackcloud',
                inPlay: ['cerasaurus-mount'],
                hand: ['power-through'],
                dicepool: ['divine']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['flute-mage', 'hammer-knight', 'anchornaut']
            }
        });
    });

    it('overkill 1', function () {
        this.player1.clickAttack(this.anchornaut);
        this.player1.clickCard(this.cerasaurusMount);
        this.player2.clickDone();
        this.player2.clickYes();

        expect(this.anchornaut.location).toBe('discard');
        expect(this.coalRoarkwin.damage).toBe(1); // cerasaurus overkill
    });

    it('with power through - overkill 2', function () {
        this.player1.play(this.powerThrough, this.cerasaurusMount);
        this.player1.clickAttack(this.anchornaut);
        this.player1.clickCard(this.cerasaurusMount);
        this.player2.clickDone();
        this.player2.clickYes();

        expect(this.anchornaut.location).toBe('discard');
        expect(this.coalRoarkwin.damage).toBe(2); // cerasaurus and powerthrough
    });
});
