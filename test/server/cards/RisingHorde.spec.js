describe('Rising Horde', function () {
    describe('When Destroyed', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['seaside-raven', 'iron-worker'],
                    dicepool: ['natural']
                },
                player2: {
                    phoenixborn: 'maeoni-viper',
                    inPlay: ['rising-horde', 'living-doll'],
                    archives: ['fallen', 'fallen', 'fallen']
                }
            });
        });

        it('places two fallen into play', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.risingHorde);
            this.player1.clickCard(this.ironWorker);

            this.player2.clickPrompt('Done'); // no blocker
            this.player2.clickPrompt('No'); // no counter

            expect(this.player1).toHaveDefaultPrompt();

            expect(this.player2.inPlay.length).toBe(3);
            expect(this.risingHorde.location).toBe('discard');
        });
    });

    describe('with summon sleeping widows', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['seaside-raven', 'iron-worker'],
                    dicepool: ['natural']
                },
                player2: {
                    phoenixborn: 'maeoni-viper',
                    inPlay: ['rising-horde', 'living-doll'],
                    archives: [
                        'fallen',
                        'fallen',
                        'fallen',
                        'sleeping-widow',
                        'sleeping-widow',
                        'sleeping-widow'
                    ],
                    dicepool: ['ceremonial', 'ceremonial'],
                    hand: ['summon-sleeping-widows']
                }
            });
        });

        it('places two fallen into play', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.risingHorde);
            this.player1.clickCard(this.ironWorker);

            this.player2.clickPrompt('Done'); // no blocker
            this.player2.clickPrompt('No'); // no counter

            expect(this.player1).not.toHaveDefaultPrompt();
            this.player2.clickCard(this.summonSleepingWidows);

            expect(this.player2.inPlay.length).toBe(4); // maeoni max
            expect(this.risingHorde.location).toBe('discard');
        });
    });
});
