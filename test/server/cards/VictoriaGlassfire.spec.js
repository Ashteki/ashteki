describe('Surprise ability', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'victoria-glassfire',
                inPlay: ['hammer-knight'],
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
                hand: ['cover', 'molten-gold']
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
                inPlay: ['flute-mage']
            }
        });
    });

    it('can be played to deal damage to a Unit', function () {
        this.player1.clickCard(this.victoriaGlassfire);
        this.player1.clickPrompt('Surprise!');
        this.player1.clickOpponentDie(0);
        this.player1.clickOpponentDie(1);
        this.player1.clickOpponentDie(2);
        this.player1.clickPrompt('Done');
        expect(this.player1).toHavePrompt('Choose 3 dice');
        this.player1.clickDie(0);
        this.player1.clickDie(1);
        this.player1.clickDie(2);
        this.player1.clickPrompt('Done');
        expect(this.player1).toHaveDefaultPrompt();
    });
});
