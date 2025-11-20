describe('Summon Stellar Oracle', function () {
    describe('Summon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: ['summon-stellar-oracle'],
                    dicepool: ['astral', 'astral', 'basic', 'basic'],
                    archives: ['stellar-oracle'],
                    deck: ['purge', 'anchornaut', 'iron-worker', 'generosity'],
                    hand: ['abundance']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });

            this.player1.player.deck = [this.purge, this.anchornaut, this.ironWorker, this.generosity];
        });

        it('should place a stellar oracle, draw 2 and return 1', function () {
            this.player1.clickCard(this.summonStellarOracle);
            this.player1.clickPrompt('Summon Stellar Oracle');
            this.player1.clickDie(1);
            this.player1.clickDone();
            expect(this.stellarOracle.location).toBe('play area');

            // SO enters play
            expect(this.player1.hand.length).toBe(3);
            expect(this.purge.location).toBe('hand');
            this.player1.clickCard(this.purge);
            expect(this.purge.location).toBe('deck');
            expect(this.anchornaut.location).toBe('hand');
        });
    });
});
