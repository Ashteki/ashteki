describe('During attack on Phoenixborn', function () {
    describe('defender exhaustion', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['sonic-swordsman', 'iron-worker', 'cloudburst-gryphon']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['anchornaut', 'mist-spirit', 'blood-archer']
                }
            });
        });

        it('side effect exhaustion of bigger defender prevents double exhaustion', function () {
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
            this.player2.clickCard(this.bloodArcher);
            this.player2.clickCard(this.ironWorker);

            this.player2.clickDone();

            expect(this.player1).toHavePrompt('Choose a fight to resolve');
            this.player1.clickCard(this.sonicSwordsman);
            expect(this.player1).toHavePrompt('Sonic Pulse 1');
            this.player1.clickCard(this.bloodArcher); // sonic pulse target
            this.player1.clickCard(this.ironWorker);

            expect(this.anchornaut.isInPlay).toBe(false); // killed by sonicswordsman
            expect(this.sonicSwordsman.exhausted).toBe(true); // attacked
            // second battle - defender has been exhausted
            expect(this.ironWorker.exhausted).toBe(true); // attacked
            expect(this.ironWorker.location).toBe('play area');
            expect(this.ironWorker.damage).toBe(0); // no counter from BA
            expect(this.bloodArcher.isInPlay).toBe(true); // not killed by ironWorker
            expect(this.bloodArcher.exhaustion).toBe(1); // not double exhausted
            expect(this.bloodArcher.damage).toBe(2); // from iron worker

            expect(this.aradelSummergaard.exhausted).toBe(false);
            expect(this.aradelSummergaard.damage).toBe(0);

            expect(this.player1).toHaveDefaultPrompt();
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

            this.player2.clickDone();

            expect(this.player1).toHavePrompt('Choose a fight to resolve');
            this.player1.clickCard(this.sonicSwordsman);
            expect(this.player1).toHavePrompt('Sonic Pulse 1');
            this.player1.clickCard(this.mistSpirit); // sonic pulse target
            this.player1.clickCard(this.ironWorker);

            expect(this.anchornaut.isInPlay).toBe(false); // killed by sonicswordsman
            expect(this.mistSpirit.isInPlay).toBe(false); // killed by ironWorker
            expect(this.sonicSwordsman.exhausted).toBe(true); // attacked
            expect(this.ironWorker.exhausted).toBe(true); // attacked
            // second battle - defender has been exhausted
            expect(this.ironWorker.damage).toBe(0); // no counter from mist spirit

            expect(this.player1).toHaveDefaultPrompt();
            expect(this.aradelSummergaard.exhausted).toBe(false);
        });

        it('side effect exhaustion of blocker prevents counter even when attacker has quick strike', function () {
            //expect(this.cloudburstGryphon.damage).toBe(0); // will check damage from mist spirit

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.aradelSummergaard); // target pb
            this.player1.clickCard(this.sonicSwordsman);
            this.player1.clickCard(this.cloudburstGryphon); // 2 attackers
            this.player1.clickPrompt('Done'); // end attacker choice

            // defender 1
            this.player2.clickCard(this.anchornaut);
            this.player2.clickCard(this.sonicSwordsman);

            // defender 2
            this.player2.clickCard(this.mistSpirit);
            this.player2.clickCard(this.cloudburstGryphon);

            this.player2.clickDone();

            expect(this.player1).toHavePrompt('Choose a fight to resolve');
            this.player1.clickCard(this.sonicSwordsman);
            expect(this.player1).toHavePrompt('Sonic Pulse 1');
            this.player1.clickCard(this.mistSpirit); // sonic pulse target
            expect(this.player1).toHavePrompt('Choose a fight to resolve');
            /*this.player1.clickCard(this.cloudburstGryphon); // This line results in failure: "TypeError: Cannot read property 'cancel' of undefined"

            expect(this.anchornaut.isInPlay).toBe(false); // killed by sonicswordsman
            expect(this.mistSpirit.isInPlay).toBe(false); // killed by gryphon
            expect(this.sonicSwordsman.exhausted).toBe(true); // attacked
            expect(this.cloudburstGryphon.exhausted).toBe(true); // attacked
            // second battle - defender has been exhausted
            expect(this.cloudburstGryphon.damage).toBe(0); // no counter from mist spirit

            expect(this.player1).toHaveDefaultPrompt();
            expect(this.aradelSummergaard.exhausted).toBe(false);*/
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
