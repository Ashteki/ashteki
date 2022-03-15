describe('Magic Syphon', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['iron-worker'],
                dicepool: ['divine', 'divine', 'charm', 'charm', 'sympathy', 'sympathy'],
                spellboard: ['magic-syphon']
            },
            player2: {
                phoenixborn: 'rin-northfell',
                inPlay: ['hammer-knight', 'mist-spirit'],
                spellboard: [],
                hand: ['rins-fury', 'shatter-pulse'],
                dicepool: ['sympathy', 'sympathy', 'sympathy', 'sympathy', 'natural', 'natural']
            }
        });
    });

    it("changes one of my dice then one of my opponent's", function () {
        this.player1.clickCard(this.magicSyphon);
        this.player1.clickPrompt('Magic Syphon');

        this.player1.clickDie(1);
        this.player1.clickDie(1);
        expect(this.player1.dicepool[1].level).toBe('class');
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('player2');
        expect(this.player1).not.toBeAbleToSelectDie(this.player1.dicepool[0]);
        this.player1.clickOpponentDie(0);
        this.player1.clickOpponentDie(0);
        expect(this.player2.dicepool[0].level).toBe('class');
        this.player1.clickOpponentDie(0);
        this.player1.clickOpponentDie(0); // deselect

        this.player1.clickPrompt('Done');

        expect(this.player1).toHaveDefaultPrompt();
    });

    it('changes one of my dice then one of mine', function () {
        this.player1.clickCard(this.magicSyphon);
        this.player1.clickPrompt('Magic Syphon');

        this.player1.clickDie(1);
        this.player1.clickDie(1);
        expect(this.player1.dicepool[1].level).toBe('class');
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('player1');
        expect(this.player1).not.toBeAbleToSelectDie(this.player2.dicepool[0]);
        this.player1.clickDie(0);
        this.player1.clickDie(0);
        //this.player1.clickDie(0);
        expect(this.player1.dicepool[0].level).toBe('class');
        this.player1.clickPrompt('Done');

        expect(this.player1).toHaveDefaultPrompt();
    });
});
