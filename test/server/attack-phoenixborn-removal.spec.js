describe('Attack Removals', function () {
    describe('During attack on Phoenixborn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight', 'iron-worker']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['anchornaut', 'mist-spirit']
                }
            });
        });

        it('side effect removal of blocker allows damage to phoenixborn', function () {
            expect(this.aradelSummergaard.damage).toBe(0); // Damage from iron worker

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.aradelSummergaard); // target pb
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.ironWorker); // 2 attackers
            this.player1.clickPrompt('Done'); // end attacker choice

            this.player2.clickCard(this.anchornaut);
            this.player2.clickCard(this.hammerKnight);
            this.player2.clickCard(this.mistSpirit);
            this.player2.clickCard(this.ironWorker);
            this.player2.clickPrompt('Done'); // blockers

            expect(this.player1).toHavePrompt('Choose a fight to resolve');
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.mistSpirit); // aftershock target
            this.player1.clickCard(this.ironWorker);

            expect(this.mistSpirit.location).toBe('archives');
            // second battle auto-resolves - defender has been removed
            expect(this.aradelSummergaard.damage).toBe(2); // Damage from iron worker
        });
    });

    describe('During attack on Phoenixborn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight', 'iron-worker', 'flute-mage']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['anchornaut', 'mist-spirit'],
                    hand: ['figures-in-the-fog', 'shatter-pulse'],
                    dicepool: ['illusion', 'sympathy', 'sympathy']
                }
            });
        });

        it('removal of attacker with figures in the fog', function () {
            expect(this.aradelSummergaard.damage).toBe(0); // Damage from iron worker

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.aradelSummergaard); // target pb
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.fluteMage);
            this.player1.clickCard(this.ironWorker); // 3 attackers
            this.player1.clickPrompt('Done'); // end attacker choice

            expect(this.player2).toBeAbleToSelect(this.figuresInTheFog);

            this.player2.clickCard(this.figuresInTheFog);
            this.player2.clickCard(this.hammerKnight); // remove hammerKnight removes hammerKnight battle

            expect(this.game.attackState.battles.length).toBe(2);
            expect(this.hammerKnight.isAttacker).toBe(false);
            expect(this.hammerKnight.exhausted).toBe(true);

            this.player2.clickPrompt('Done'); // no blockers
            this.player1.clickCard(this.ironWorker);
            this.player1.clickCard(this.fluteMage);

            expect(this.aradelSummergaard.damage).toBe(3); // Damage from iron worker

            expect(this.player1).toHaveDefaultPrompt();
        });

        it('removal of attacker with shatter pulse', function () {
            expect(this.aradelSummergaard.damage).toBe(0); // Damage from iron worker

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.aradelSummergaard); // target pb
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.fluteMage);
            this.player1.clickCard(this.ironWorker); // 3 attackers
            this.player1.clickPrompt('Done'); // end attacker choice
            this.player2.clickPass(); // FITF reaction

            this.player2.clickCard(this.anchornaut);
            this.player2.clickCard(this.fluteMage);

            this.player2.clickCard(this.hammerKnight);
            this.player2.clickCard(this.mistSpirit);

            this.player2.clickPrompt('Done');

            this.player1.clickCard(this.fluteMage); // resolve

            this.player2.clickCard(this.shatterPulse);
            this.player2.clickDie(0);
            this.player2.clickDone();
            this.player2.clickCard(this.hammerKnight);
            this.player2.clickDone(); // no dice fixing

            expect(this.game.attackState.battles.length).toBe(2);
            this.player1.clickCard(this.ironWorker); // resolve

            expect(this.hammerKnight.isAttacker).toBe(false);
            expect(this.hammerKnight.location).toBe('discard');

            this.player1.clickCard(this.ironWorker);

            expect(this.aradelSummergaard.damage).toBe(2); // Damage from iron worker
            expect(this.mistSpirit.location).toBe('play area');

            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
