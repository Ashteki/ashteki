describe('Exhortation action spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['iron-worker'],
                dicepool: ['natural', 'sympathy', 'charm'],
                hand: ['exhortation']
            },
            player2: {
                phoenixborn: 'issa-brightmore',
                inPlay: ['flute-mage'],
                dicepool: ['artifice', 'artifice', 'natural'],
                hand: ['barrier'],
                deck: ['molten-gold']
            }
        });
    });

    it('cannot use if only one unit is in play', function () {
        this.player1.clickCard(this.exhortation);
        this.player1.clickCard(this.ironWorker);
        this.player1.clickCard(this.ironWorker);
        
        expect(this.player1).not.toHaveDefaultPrompt();

        this.player1.clickCancel();
        expect(this.player1).toHaveDefaultPrompt();
    });
});
