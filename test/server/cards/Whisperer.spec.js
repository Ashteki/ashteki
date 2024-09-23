describe('Whisperer', function () {
    describe('Haunt with dice to lower', function () {
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
                    inPlay: ['whisperer', 'iron-worker'],
                    hand: ['out-of-the-mist'],
                    dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm']
                }
            });
        });

        it('spin down ability triggers when exhausted', function () {
            expect(this.player1.dicepool[0].level).toBe('power');
            this.whisperer.tokens.exhaustion = 1;
            this.player1.clickAttack(this.whisperer);
            this.player1.clickCard(this.crimsonBomber);
            this.player2.clickPrompt('Done');
            // no counter prompt because of exhaustion
            this.player2.clickOpponentDie(0);
            expect(this.player1.dicepool[0].level).toBe('class');
            expect(this.whisperer.location).toBe('archives');
        });
    });

    describe('haunt with no dice targets', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['crimson-bomber'],
                    hand: ['molten-gold']
                },
                player2: {
                    phoenixborn: 'maeoni-viper',
                    inPlay: ['whisperer', 'iron-worker'],
                    hand: ['out-of-the-mist'],
                    dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm']
                }
            });
        });

        it('spin down ability triggers when exhausted', function () {
            expect(this.aradelSummergaard.damage).toBe(0);
            this.whisperer.tokens.exhaustion = 1;
            this.player1.clickAttack(this.whisperer);
            this.player1.clickCard(this.crimsonBomber);
            this.player2.clickPrompt('Done');
            // no counter prompt because of exhaustion
            expect(this.aradelSummergaard.damage).toBe(1);
            expect(this.whisperer.location).toBe('archives');
        });
    });
});
