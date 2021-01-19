describe('Particle Shield reaction spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['blue-jaguar', 'mist-spirit', 'iron-worker'],
                dicepool: ['natural']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['flute-mage'],
                dicepool: ['illusion', 'natural'],
                hand: ['particle-shield'],
                deck: ['molten-gold']
            }
        });
    });

    it('should prevent damage on attack and give draw', function () {
        expect(this.fluteMage.damage).toBe(0);
        expect(this.player2.deck.length).toBe(4);
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.fluteMage);
        this.player1.clickCard(this.ironWorker);
        this.player2.clickPrompt('Done');
        this.player2.clickPrompt('No');

        this.player2.clickCard(this.particleShield);
        expect(this.particleShield.location).toBe('discard');
        expect(this.fluteMage.damage).toBe(1);
        expect(this.player2.hand.length).toBe(1);
        expect(this.player2.deck.length).toBe(3);
    });

    it('should prevent damage on ability and give draw', function () {
        expect(this.fluteMage.damage).toBe(0);
        expect(this.player2.deck.length).toBe(4);
        this.player1.clickCard(this.aradelSummergaard);
        this.player1.clickPrompt('Water Blast');
        this.player1.clickCard(this.fluteMage);

        this.player2.clickCard(this.particleShield);
        expect(this.particleShield.location).toBe('discard');
        expect(this.fluteMage.damage).toBe(1);
        expect(this.player2.hand.length).toBe(1);
        expect(this.player2.deck.length).toBe(3);
    });

    it('can prevent self inflicted damage', function () {
        expect(this.fluteMage.damage).toBe(0);
        expect(this.player2.deck.length).toBe(4);
        this.player1.endTurn();

        this.player2.clickCard('aradel-summergaard', 'any', 'self');
        this.player2.clickPrompt('Water Blast');
        this.player2.clickCard(this.fluteMage);

        this.player2.clickCard(this.particleShield);
        expect(this.particleShield.location).toBe('discard');
        expect(this.fluteMage.damage).toBe(1);
        expect(this.player2.hand.length).toBe(1);
        expect(this.player2.deck.length).toBe(3);
    });
});
