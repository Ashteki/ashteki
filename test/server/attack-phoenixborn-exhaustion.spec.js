describe('During attack on Phoenixborn', function () {
    describe('defender exhaustion', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['sonic-swordsman', 'iron-worker']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['anchornaut', 'mist-spirit']
                }
            });
        });

        it('side effect exhaustion of blocker prevents counter', function () {
            expect(this.ironWorker.damage).toBe(0); // will check damage from mist spirit

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.aradelSummergaard); // target pb
            this.player1.clickCard(this.sonicSwordsman);
            this.player1.clickCard(this.ironWorker); // 2 attackers
            this.player1.clickPrompt('Done'); // end attacker choice

            // defender 1
            this.player2.clickCard(this.anchornaut);
            this.player2.clickCard(this.sonicSwordsman);

            // defender 2
            this.player2.clickCard(this.mistSpirit);
            this.player2.clickCard(this.ironWorker);

            expect(this.player1).toHavePrompt('Choose a fight to resolve');
            this.player1.clickCard(this.sonicSwordsman);
            expect(this.player1).toHavePrompt('Sonic Pulse 1');
            this.player1.clickCard(this.mistSpirit); // sonic pulse target

            expect(this.anchornaut.isInPlay).toBe(false); // killed by sonicswordsman
            expect(this.mistSpirit.isInPlay).toBe(false); // killed by ironWorker
            expect(this.sonicSwordsman.exhausted).toBe(true); // attacked
            expect(this.ironWorker.exhausted).toBe(true); // attacked
            // second battle auto-resolves - defender has been exhausted
            expect(this.ironWorker.damage).toBe(0); // no counter from mist spirit

            expect(this.player1).toHaveDefaultPrompt();
            expect(this.aradelSummergaard.exhausted).toBe(false);
        });
    });

    describe('attacker exhaustion', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-rhino', 'iron-worker']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['nightshade-swallow', 'mist-spirit']
                }
            });
        });

        it('side effect exhaustion of attacker removes their attack', function () {
            expect(this.ironWorker.damage).toBe(0); // will check damage from mist spirit
            expect(this.ironRhino.exhaustion).toBe(0);

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.aradelSummergaard); // target pb
            this.player1.clickCard(this.ironRhino);
            this.player1.clickCard(this.ironWorker); // 2 attackers
            this.player1.clickPrompt('Done'); // end attacker choice

            // defender 1
            this.player2.clickCard(this.nightshadeSwallow);
            this.player2.clickCard(this.ironWorker);

            this.player2.clickPrompt('Done');

            expect(this.player1).toHavePrompt('Choose a fight to resolve');
            this.player1.clickCard(this.ironWorker);
            expect(this.player2).toHavePrompt('Pacify 1');
            this.player2.clickCard(this.ironRhino); // exhaust Iron rhino

            expect(this.nightshadeSwallow.isInPlay).toBe(false); // killed by ironWorker
            expect(this.ironRhino.exhausted).toBe(true); // ability
            expect(this.ironWorker.exhausted).toBe(true); // attacked
            expect(this.ironRhino.exhaustion).toBe(1); // don't double exhaust

            expect(this.player1).toHaveDefaultPrompt();
            expect(this.aradelSummergaard.damage).toBe(0); // no damage
        });
    });
});
