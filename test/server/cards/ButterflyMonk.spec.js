describe('Butterfly Monk', function () {
    describe('Standard', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['seaside-raven'],
                    dicepool: ['natural']
                },
                player2: {
                    phoenixborn: 'maeoni-viper',
                    inPlay: ['butterfly-monk', 'living-doll']
                }
            });

            this.maeoniViper.tokens.damage = 1;
            this.livingDoll.tokens.damage = 1;
        });

        it('triggers when destroyed. Heal PB', function () {
            expect(this.maeoniViper.damage).toBe(1);
            expect(this.livingDoll.damage).toBe(1);

            this.player1.clickCard(this.aradelSummergaard);
            this.player1.clickPrompt('Water Blast');
            this.player1.clickCard(this.butterflyMonk);

            this.player2.clickCard(this.maeoniViper);

            expect(this.butterflyMonk.location).toBe('archives');
            expect(this.maeoniViper.damage).toBe(0);
            expect(this.livingDoll.damage).toBe(1);
        });

        it('triggers when destroyed. Heal unit', function () {
            expect(this.maeoniViper.damage).toBe(1);
            expect(this.livingDoll.damage).toBe(1);

            this.player1.clickCard(this.aradelSummergaard);
            this.player1.clickPrompt('Water Blast');
            this.player1.clickCard(this.butterflyMonk);

            this.player2.clickCard(this.livingDoll);

            expect(this.butterflyMonk.location).toBe('archives');
            expect(this.maeoniViper.damage).toBe(1);
            expect(this.livingDoll.damage).toBe(0);
        });

        it('triggers when destroyed by blocking. Heal PB', function () {
            expect(this.maeoniViper.damage).toBe(1);

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.maeoniViper);
            this.player1.clickCard(this.seasideRaven);
            this.player1.clickPrompt('Done');
            this.player2.clickCard(this.butterflyMonk);
            this.player2.clickCard(this.seasideRaven);
            this.player2.clickPrompt('Done');
            expect(this.player2).toHavePrompt('Mend 1');
            this.player2.clickCard(this.maeoniViper);

            expect(this.butterflyMonk.location).toBe('archives');
            expect(this.maeoniViper.damage).toBe(0);
        });

        it('triggers when exhausted. direct damage', function () {
            expect(this.livingDoll.damage).toBe(1);
            this.butterflyMonk.tokens.exhaustion = 1;

            this.player1.clickCard(this.aradelSummergaard);
            this.player1.clickPrompt('Water Blast');
            this.player1.clickCard(this.butterflyMonk);

            this.player2.clickCard(this.livingDoll);

            expect(this.butterflyMonk.location).toBe('archives');
            expect(this.livingDoll.damage).toBe(0);
        });
    });

    describe('Bug report taj', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'saria-guideman',
                    inPlay: ['seaside-raven', 'beast-tamer'],
                    dicepool: ['natural']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['butterfly-monk', 'living-doll']
                }
            });

            this.livingDoll.tokens.damage = 1;
        });

        it('triggers when destroyed by blocking. Heal livingDoll', function () {
            expect(this.livingDoll.damage).toBe(1);

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.rinNorthfell);
            this.player1.clickCard(this.beastTamer);
            this.player1.clickPrompt('Done');
            this.player2.clickCard(this.butterflyMonk);
            this.player2.clickCard(this.beastTamer);
            this.player2.clickPrompt('Done');
            expect(this.player2).toHavePrompt('Mend 1');
            this.player2.clickCard(this.livingDoll);

            expect(this.butterflyMonk.location).toBe('archives');
            expect(this.livingDoll.damage).toBe(0);
        });

        // did not reproduce the problem :/
    });
});
