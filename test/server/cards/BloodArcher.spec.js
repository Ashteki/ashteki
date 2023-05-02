describe('Blood Archer', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'brennen-blackcloud',
                inPlay: ['blood-archer', 'glow-finch']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['flute-mage', 'hammer-knight', 'anchornaut']
            }
        });
    });

    it('use blood shot', function () {
        this.player1.clickCard(this.bloodArcher);
        this.player1.clickPrompt('Blood Shot');
        this.player1.clickCard(this.fluteMage);

        expect(this.bloodArcher.damage).toBe(1);
        expect(this.bloodArcher.exhaustion).toBe(0);
        expect(this.fluteMage.damage).toBe(1);
    });

    it('use blood shot when it destroys self', function () {
        this.bloodArcher.tokens.damage = 2;
        this.player1.clickCard(this.bloodArcher);
        this.player1.clickPrompt('Blood Shot');
        this.player1.clickCard(this.fluteMage);

        expect(this.bloodArcher.location).toBe('discard');
        expect(this.fluteMage.damage).toBe(1);
    });

    it('vs glow finch triggers GF discard', function () {
        const deckSize = this.player2.deck.length;
        this.player1.clickCard(this.bloodArcher);
        this.player1.clickPrompt('Blood Shot');
        this.player1.clickCard(this.glowFinch);
        this.player1.clickYes();

        expect(this.bloodArcher.damage).toBe(1);
        expect(this.bloodArcher.exhaustion).toBe(0);
        expect(this.glowFinch.location).toBe('archives');
        expect(this.player2.deck.length).toBe(deckSize - 2);
    });

});
