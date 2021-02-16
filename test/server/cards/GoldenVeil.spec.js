describe('Golden Veil', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'maeoni-viper',
                inPlay: ['mist-spirit', 'iron-worker'],
                dicepool: ['ceremonial', 'natural', 'natural', 'charm'],
                hand: ['molten-gold']
            },
            player2: {
                phoenixborn: 'rin-northfell',
                inPlay: ['hammer-knight'],
                dicepool: ['charm', 'natural'],
                hand: ['golden-veil']
            }
        });
    });

    it('cancels molten gold on unit', function () {
        this.player1.clickCard(this.moltenGold);
        this.player1.clickPrompt('Play this action');
        this.player1.clickCard(this.hammerKnight);

        expect(this.player2).toHavePrompt('Any Interrupts to molten gold?');
        this.player2.clickCard(this.goldenVeil);

        expect(this.hammerKnight.damage).toBe(0);
        expect(this.hammerKnight.location).toBe('play area');
        expect(this.player1).toHaveDefaultPrompt();
    });

    it('cancels multi-target ability - Maeoni', function () {
        this.player1.clickCard(this.maeoniViper);
        this.player1.clickPrompt('Command Strike');
        this.player1.clickDie(0);
        this.player1.clickDie(2);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.ironWorker);
        this.player1.clickCard(this.hammerKnight);

        expect(this.player2).toHavePrompt('Any Interrupts to command strike?');
        this.player2.clickCard(this.goldenVeil);

        expect(this.hammerKnight.damage).toBe(0);
        expect(this.hammerKnight.location).toBe('play area');
        expect(this.player1).toHaveDefaultPrompt();
    });
});
