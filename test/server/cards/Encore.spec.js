describe('Encore action spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'namine-hymntide',
                inPlay: ['iron-worker'],
                dicepool: ['natural', 'ceremonial', 'charm', 'sympathy'],
                hand: ['encore'],
                discard: ['anchornaut', 'encore']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['blue-jaguar', 'mist-spirit'],
                spellboard: ['empower', 'summon-mist-spirit']
            }
        });
    });

    it('returns a card from discard to top of deck and draw a card', function () {
        expect(this.anchornaut.location).toBe('discard');
        this.player1.play(this.encore);
        this.player1.clickCard(this.anchornaut);
        this.player1.clickPrompt('Top');

        expect(this.anchornaut.location).toBe('hand');
    });

    it('returns a card from discard to bottom of deck and draw a card', function () {
        expect(this.anchornaut.location).toBe('discard');
        this.player1.play(this.encore);
        this.player1.clickCard(this.anchornaut);
        this.player1.clickPrompt('Bottom');

        expect(this.anchornaut.location).toBe('deck');
    });

    it('may not choose encore', function () {
        expect(this.anchornaut.location).toBe('discard');
        this.player1.play(this.encore);
        expect(this.player1).toBeAbleToSelect(this.anchornaut);
        expect(this.player1.discard[1].name).toBe('Encore');
        expect(this.player1).not.toBeAbleToSelect(this.player1.discard[1]);
    });
});
