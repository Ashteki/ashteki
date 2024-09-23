describe('Magnificence', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'victoria-glassfire',
                inPlay: ['anchornaut'],
                spellboard: [],
                dicepool: [
                    'natural',
                    'natural',
                    'charm',
                    'charm',
                    'illusion',
                    'illusion',
                    'illusion',
                    'charm'
                ],
                hand: ['cover', 'magnificence']
            },
            player2: {
                phoenixborn: 'saria-guideman',
                dicepool: [
                    'time',
                    'divine',
                    'sympathy',
                    'ceremonial'
                ],
                hand: ['sympathy-pain'],
                inPlay: ['flute-mage', 'hammer-knight', 'fox-spirit']
            }
        });
    });

    it('can be played to reroll dice, invert and damage opponent', function () {
        this.player1.play(this.magnificence);
        this.player1.clickOpponentDie(0);
        this.player1.clickOpponentDie(1);
        this.player1.clickOpponentDie(2);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.fluteMage);
        this.player1.clickCard(this.hammerKnight);
        this.player1.clickCard(this.hammerKnight);
        expect(this.hammerKnight.damage).toBe(2);
        expect(this.player1).toHaveDefaultPrompt();
    });
});
