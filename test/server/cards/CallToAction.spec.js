describe('Call to action reaction', function () {
    describe('unexhausts a unit that can then block - PB attack', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-rhino', 'iron-worker']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['nightshade-swallow', 'mist-spirit'],
                    hand: ['call-to-action'],
                    dicepool: ['charm']
                }
            });

            this.mistSpirit.tokens.exhaustion = 1;
        });

        it('side effect exhaustion of attacker removes their attack', function () {
            expect(this.ironWorker.damage).toBe(0); // will check damage from mist spirit
            expect(this.ironRhino.exhaustion).toBe(0);

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.aradelSummergaard); // target pb
            this.player1.clickCard(this.ironWorker);
            this.player1.clickPrompt('Done'); // end attacker choice

            // reaction
            this.player2.clickCard(this.callToAction);
            this.player2.clickCard(this.mistSpirit);
            expect(this.mistSpirit.exhausted).toBe(false);
            expect(this.player2).toHavePrompt('Choose a blocker');
            expect(this.player2).toBeAbleToSelect(this.mistSpirit);
            // defender 1
            this.player2.clickCard(this.mistSpirit);
            this.player2.clickCard(this.ironWorker);
            this.player2.clickPrompt('Done');

            expect(this.mistSpirit.location).toBe('archives'); // killed by ironWorker
            expect(this.ironWorker.exhausted).toBe(true); // attacked

            expect(this.player1).toHaveDefaultPrompt();
            expect(this.aradelSummergaard.damage).toBe(0); // no damage
            expect(this.ironWorker.damage).toBe(1);
        });
    });

    describe('BUG: Frostback bear attacking, sun sister defending', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['frostback-bear', 'iron-worker']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['nightshade-swallow', 'sun-sister'],
                    hand: ['call-to-action'],
                    dicepool: ['charm']
                }
            });

            this.sunSister.tokens.exhaustion = 1;
        });

        it('side effect exhaustion of attacker removes their attack', function () {
            expect(this.frostbackBear.damage).toBe(0);
            expect(this.sunSister.exhausted).toBe(true);

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.aradelSummergaard); // target pb
            this.player1.clickCard(this.frostbackBear);
            this.player1.clickPrompt('Done'); // end attacker choice

            // reaction
            this.player2.clickCard(this.callToAction);
            this.player2.clickCard(this.sunSister);
            expect(this.sunSister.exhausted).toBe(false);
            expect(this.player2).toHavePrompt('Choose a blocker');
            expect(this.player2).toBeAbleToSelect(this.sunSister);
            // defender 1
            this.player2.clickCard(this.sunSister);
            this.player2.clickCard(this.frostbackBear);
            this.player2.clickPrompt('Done'); // (no other valid options because of terrifying 1)

            expect(this.sunSister.location).toBe('discard'); // killed by FBB
            expect(this.frostbackBear.exhausted).toBe(true); // attacked

            expect(this.player1).toHaveDefaultPrompt();
            expect(this.aradelSummergaard.damage).toBe(0); // no damage
            expect(this.frostbackBear.damage).toBe(2);
        });
    });

});
