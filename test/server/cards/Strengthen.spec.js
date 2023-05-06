describe('Strengthen', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                dicepool: ['illusion', 'natural', 'natural'],
                spellboard: ['strengthen'],
                hand: ['crystal-shield'],
                inPlay: ['anchornaut']
            },
            player2: {
                phoenixborn: 'maeoni-viper',
                inPlay: ['iron-worker', 'frost-fang', 'silver-snake'],
                dicepool: ['illusion', 'natural', 'natural'],
                spellboard: ['body-inversion'],
                hand: ['crystal-shield']
            }
        });
    });

    it('adds 2 to attack value', function () {
        this.player1.clickCard(this.strengthen);
        this.player1.clickPrompt('Strengthen a unit');
        this.player1.clickCard(this.anchornaut);

        expect(this.anchornaut.attack).toBe(2);
        expect(this.player1.player.actions.side).toBe(0);
    });

    it('can be cancelled', function () {
        this.player1.clickCard(this.strengthen);
        this.player1.clickPrompt('Strengthen a unit');
        this.player1.clickPrompt('Cancel');

        expect(this.anchornaut.attack).toBe(0);
        expect(this.player1.player.actions.side).toBe(1);
    });
});
