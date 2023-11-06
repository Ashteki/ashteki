describe('Sympathy Dice Power', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['anchornaut'],
                dicepool: ['sympathy'],
                spellboard: ['summon-gilder'],
                hand: ['purge']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['blue-jaguar', 'iron-worker'],
                spellboard: ['summon-mist-spirit']
            }
        });
    });

    it('draw 1 card and return one to deck', function () {
        const handSize = this.player1.hand.length;
        this.player1.clickDie(0);
        this.player1.clickPrompt('Sympathy Dice Power');
        expect(this.player1.hand.length).toBe(handSize + 1);
        this.player1.clickCard(this.purge);
        this.player1.clickPrompt('Top');
        expect(this.player1.hand.length).toBe(handSize);
        expect(this.player1).toHaveDefaultPrompt();
    });

    it('cancel prompt 1', function () {
        const handSize = this.player1.hand.length;
        this.player1.clickDie(0);
        this.player1.clickPrompt('Sympathy Dice Power');
        expect(this.player1.hand.length).toBe(handSize + 1);
        this.player1.clickDone();

        expect(this.player1.hand.length).toBe(handSize + 1);
        expect(this.player1).toHaveDefaultPrompt();
    });

    it('cancel prompt 2', function () {
        const handSize = this.player1.hand.length;
        this.player1.clickDie(0);
        this.player1.clickPrompt('Sympathy Dice Power');
        expect(this.player1.hand.length).toBe(handSize + 1);
        this.player1.clickCard(this.purge);
        this.player1.clickCancel();
        expect(this.player1.hand.length).toBe(handSize + 1);
        expect(this.player1).toHaveDefaultPrompt();
        expect(this.player1.dicepool[0].exhausted).toBe(true);
    });
});
