describe('Illusion Dice Power', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['anchornaut'],
                dicepool: ['illusion', 'time', 'ceremonial'],
                spellboard: ['summon-gilder']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['blue-jaguar', 'iron-worker'],
                spellboard: ['summon-mist-spirit'],
                dicepool: ['illusion', 'time', 'ceremonial']
            }
        });
    });

    it('dial down 2 dice', function () {
        this.player1.clickDie(0);
        this.player1.clickPrompt('Illusion Dice Power');
        this.player1.clickOpponentDie(0);
        this.player1.clickOpponentDie(1);
        this.player1.clickDone();
        expect(this.player2.dicepool[0].level).toBe('class');
        expect(this.player2.dicepool[1].level).toBe('class');

        expect(this.player1).toHaveDefaultPrompt();
    });

    it('can be cancelled, no selection', function () {
        this.player1.clickDie(0);
        this.player1.clickPrompt('Illusion Dice Power');
        this.player1.clickPrompt('Cancel');
        expect(this.player1.actions.side).toBe(1);
        expect(this.player1.dicepool[0].exhausted).toBe(false);

        expect(this.player1).toHaveDefaultPrompt();
    });

    it('can be cancelled with selection', function () {
        this.player1.clickDie(0);
        this.player1.clickPrompt('Illusion Dice Power');
        this.player1.clickOpponentDie(0);

        this.player1.clickPrompt('Cancel');
        expect(this.player2.dicepool[0].level).toBe('power');

        expect(this.player1.actions.side).toBe(1);
        expect(this.player1.dicepool[0].exhausted).toBe(false);

        expect(this.player1).toHaveDefaultPrompt();
    });
});
