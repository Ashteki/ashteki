const Dice = require('../../../server/game/dice');

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

    it('rerolls each die', function () {
        spyOn(Dice, 'getRandomInt').and.returnValue(4);

        this.player1.clickCard(this.victoriaGlassfire);
        this.player1.clickPrompt('Surprise!');
        this.player1.clickOpponentDie(0);
        this.player1.clickOpponentDie(1);
        this.player1.clickOpponentDie(2);
        this.player1.clickPrompt('Done');
        expect(Dice.getRandomInt).toHaveBeenCalledTimes(3);
        expect(this.player1).toHavePrompt('Choose 3 dice');
        this.player1.clickDie(0);
        this.player1.clickDie(1);
        this.player1.clickDie(2);
        this.player1.clickPrompt('Done');
        expect(Dice.getRandomInt).toHaveBeenCalledTimes(6);
        expect(this.player1).toHaveDefaultPrompt();
    });

    it('BUG: dice pin does not affect rerolls', function () {
        spyOn(Dice, 'getRandomInt').and.returnValue(4);
        this.player1.endTurn();
        this.player2.endTurn();
        this.player1.clickDone();
        // keeping dice 0 and 1
        this.player2.clickDie(0);
        this.player2.clickDie(1);
        this.player2.clickDone();
        this.player1.clickNo();
        this.player2.clickNo();
        this.player2.endTurn();

        this.player1.clickCard(this.victoriaGlassfire);
        this.player1.clickPrompt('Surprise!');
        this.player1.clickOpponentDie(0);
        this.player1.clickOpponentDie(1);
        this.player1.clickPrompt('Done');
        this.player1.clickDie(0);
        this.player1.clickDie(1);
        this.player1.clickDie(2);
        this.player1.clickPrompt('Done');
        expect(Dice.getRandomInt).toHaveBeenCalledTimes(6);
        expect(this.player1).toHaveDefaultPrompt();
    });
});
