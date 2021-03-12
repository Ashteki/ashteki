describe('JungleWarrior', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['seaside-raven'],
                dicepool: ['natural']
            },
            player2: {
                phoenixborn: 'maeoni-viper',
                inPlay: ['jungle-warrior', 'living-doll'],
                dicepool: ['natural']
            }
        });
        this.livingDoll.tokens.exhaustion = 1;
    });

    it('triggers when destroyed. Choice of ability order if other unit in play', function () {
        this.player1.clickCard(this.aradelSummergaard);
        this.player1.clickPrompt('Water Blast');
        this.player1.clickCard(this.jungleWarrior);

        // on destroy choices...
        expect(this.player2).toHavePrompt('Choose an ability to use');
        this.player2.clickPrompt('Inheritance 1');
        this.player2.clickCard(this.livingDoll);

        this.player2.clickPrompt('Cancel'); // not doing last orders 1 (select dice prompt)

        expect(this.jungleWarrior.location).toBe('discard');
        expect(this.livingDoll.status).toBe(1);
    });
});
