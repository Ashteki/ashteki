describe('Turtle Guard', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['crimson-bomber'],
                dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm'],
                hand: ['molten-gold']
            },
            player2: {
                phoenixborn: 'maeoni-viper',
                inPlay: ['turtle-guard', 'iron-worker'],
                hand: ['out-of-the-mist'],
                dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm']
            }
        });

        this.aradelSummergaard.tokens.damage = 1;
        this.player1.dicepool[0].lower();
    });

    it('prevent damage received when attacked while exhausted', function () {
        this.turtleGuard.tokens.exhaustion = 1;
        this.player1.clickAttack(this.turtleGuard);
        this.player1.clickCard(this.crimsonBomber);
        this.player2.clickPrompt('Done');
        // no counter prompt because of exhaustion

        expect(this.turtleGuard.damage).toBe(0);
        expect(this.turtleGuard.location).toBe('play area');
    });

    it('damage received when attacked while not exhausted', function () {
        this.player1.clickAttack(this.turtleGuard);
        this.player1.clickCard(this.crimsonBomber);
        this.player2.clickPrompt('Done');
        this.player2.clickYes();

        expect(this.turtleGuard.location).toBe('archives'); // dead
    });
});
