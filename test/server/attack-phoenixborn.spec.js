describe('Attack on Phoenixborn', function () {
    describe('Phoenixborn ready', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['mist-spirit', 'iron-worker']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['flute-mage', 'anchornaut']
                }
            });
        });

        it('multiple attackers prompt for resolution order', function () {
            expect(this.fluteMage.tokens.damage).toBeUndefined();
            expect(this.mistSpirit.tokens.damage).toBeUndefined();

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.coalRoarkwin); // target
            this.player1.clickCard(this.mistSpirit);
            this.player1.clickCard(this.ironWorker); // 2 attackers
            this.player1.clickPrompt('Done'); // end attacker choice

            this.player2.clickPrompt('Done'); // no blockers
            expect(this.player1).toHavePrompt('Choose a fight to resolve');
            expect(this.player1).toBeAbleToSelect(this.mistSpirit);
            expect(this.player1).toBeAbleToSelect(this.ironWorker);

            this.player1.clickCard(this.ironWorker);
            this.player1.clickCard(this.mistSpirit);

            expect(this.coalRoarkwin.damage).toBe(3); // Damage from both have resolved
            expect(this.player1).not.toBeAbleToSelect(this.mistSpirit);
            expect(this.player1).not.toBeAbleToSelect(this.ironWorker);
        });

        it('defender may choose not to block', function () {
            expect(this.coalRoarkwin.tokens.damage).toBeUndefined();
            expect(this.ironWorker.tokens.damage).toBeUndefined();

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.coalRoarkwin); // target
            this.player1.clickCard(this.ironWorker); // single attacker
            this.player1.clickPrompt('Done'); // end attacker choice

            this.player2.clickPrompt('Done'); // no blockers

            // damage to pb
            expect(this.coalRoarkwin.tokens.damage).toBe(2);
            expect(this.coalRoarkwin.exhausted).toBe(false);

            // no damage to attacker
            expect(this.ironWorker.tokens.damage).toBeUndefined();
        });

        it('defender may choose to block with auto counter', function () {
            expect(this.coalRoarkwin.tokens.damage).toBeUndefined();
            expect(this.ironWorker.tokens.damage).toBeUndefined();

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.coalRoarkwin); // target
            this.player1.clickCard(this.ironWorker);
            this.player1.clickPrompt('Done'); // end attacker choice

            this.player2.clickCard(this.fluteMage); // blocker
            expect(this.player2).toBeAbleToSelect(this.ironWorker);
            this.player2.clickCard(this.ironWorker); // who to block
            this.player2.clickPrompt('Done'); // for blockers

            // damage to pb
            expect(this.coalRoarkwin.tokens.damage).toBeUndefined();
            expect(this.coalRoarkwin.exhausted).toBe(false);

            // counter damage to attacker
            expect(this.ironWorker.tokens.damage).toBe(1);
            expect(this.fluteMage.location).toBe('discard');
        });

        it('defender may choose multiple blockers', function () {
            expect(this.coalRoarkwin.tokens.damage).toBeUndefined();
            expect(this.ironWorker.tokens.damage).toBeUndefined();

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.coalRoarkwin); // target
            this.player1.clickCard(this.ironWorker);
            this.player1.clickCard(this.mistSpirit);
            this.player1.clickPrompt('Done'); // end attacker choice

            this.player2.clickCard(this.fluteMage); // blocker
            expect(this.player2).toBeAbleToSelect(this.ironWorker);
            this.player2.clickCard(this.ironWorker); // who to block
            this.player2.clickCard(this.anchornaut); // blocker
            this.player2.clickCard(this.mistSpirit); // who to block

            this.player2.clickPrompt('Done'); // for blockers, always click 'done'

            this.player1.clickCard(this.ironWorker);
            this.player1.clickCard(this.mistSpirit);

            expect(this.player1).toHaveDefaultPrompt();
            // no damage to pb
            expect(this.coalRoarkwin.damage).toBe(0);
            expect(this.coalRoarkwin.exhausted).toBe(false);

            // counter damage to attacker
            expect(this.ironWorker.damage).toBe(1);
            expect(this.fluteMage.location).toBe('discard');
            expect(this.mistSpirit.damage).toBe(0);
            expect(this.anchornaut.location).toBe('discard');

            expect(this.anchornaut.isDefender).toBe(false);
            expect(this.fluteMage.isDefender).toBe(false);
        });
    });

    describe('Phoenixborn exhausted with alert blocker - bug', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['mist-spirit', 'iron-worker']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight', 'iron-worker']
                }
            });

            this.coalRoarkwin.tokens.exhaustion = 1;
        });

        it('defender may choose to block with auto counter', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.coalRoarkwin); // target
            this.player1.clickCard(this.ironWorker); // single attacker
            this.player1.clickPrompt('Done'); // end attacker choice

            this.player2.clickCard(this.hammerKnight); // blocker
            this.player2.clickCard(this.ironWorker); // who to block
            this.player2.clickPrompt('Done'); // for blockers

            // damage to pb
            expect(this.coalRoarkwin.tokens.damage).toBeUndefined();
            expect(this.coalRoarkwin.tokens.exhaustion).toBe(1);

            // counter damage to attacker
            expect(this.ironWorker.location).toBe('discard');
            expect(this.hammerKnight.damage).toBe(2);
        });
    });
});
