describe('Take to the Skies', function () {
    describe('action spell', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'dimona-odinstar',
                    dicepool: ['divine', 'ceremonial', 'ceremonial', 'charm', 'illusion'],
                    inPlay: ['fire-archer'],
                    archives: ['divinity-mount'],
                    hand: ['take-to-the-skies']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural'],
                    inPlay: ['iron-worker'],
                    spellboard: ['chant-of-revenge']
                }
            });
        });

        it('places divinity mount into play', function () {
            this.dimonaOdinstar.tokens.exhaustion = 1;
            this.player1.play(this.takeToTheSkies);
            this.player1.clickDie(0);

            expect(this.divinityMount.location).toBe('play area');
        });

        it('does nothing if pb not exhausted', function () {
            this.player1.play(this.takeToTheSkies);
            this.player1.clickDie(0);

            expect(this.divinityMount.location).toBe('archives');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
