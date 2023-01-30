describe('Final Stand', function () {
    describe('both conditions', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['mist-spirit', 'anchornaut'],
                    dicepool: ['time', 'illusion', 'charm', 'charm'],
                    spellboard: [],
                    hand: ['final-stand'],
                    deck: ['hammer-knight']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['iron-worker']
                }
            });
        });

        it('when played, deal 4 damage if hand empty, then deal 2 if at 12+ damage', function () {
            this.coalRoarkwin.tokens.damage = 12;

            this.player1.play(this.finalStand); // play card
            this.player1.clickDie(0);

            this.player1.clickCard(this.ironWorker); // 4 damage
            this.player1.clickCard(this.aradelSummergaard); // 2 damage

            expect(this.ironWorker.location).toBe('discard');
            expect(this.aradelSummergaard.damage).toBe(2);
        });
    });

    describe('second condition only', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['mist-spirit', 'anchornaut'],
                    dicepool: ['time', 'illusion', 'charm', 'charm'],
                    spellboard: [],
                    hand: ['final-stand', 'flute-mage'],
                    deck: ['hammer-knight']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['iron-worker']
                }
            });
        });

        it('when played, deal 0 damage if hand not empty, then deal 2 if at 12+ damage', function () {
            this.coalRoarkwin.tokens.damage = 12;

            this.player1.play(this.finalStand); // play card
            this.player1.clickDie(0);

            this.player1.clickCard(this.aradelSummergaard); // 2 damage

            expect(this.ironWorker.location).toBe('play area');
            expect(this.aradelSummergaard.damage).toBe(2);
        });
    });
}); 