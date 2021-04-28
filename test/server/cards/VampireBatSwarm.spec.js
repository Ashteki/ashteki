describe('Vampire Bat Swarm', function () {
    describe('as defender', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['iron-worker'],
                    dicepool: ['natural']
                },
                player2: {
                    phoenixborn: 'maeoni-viper',
                    inPlay: ['vampire-bat-swarm', 'living-doll'],
                    dicepool: ['natural', 'ceremonial']
                }
            });
            this.livingDoll.tokens.exhaustion = 1;
        });

        it('triggers when destroyed. choose to swarm', function () {
            this.player1.clickCard(this.aradelSummergaard);
            this.player1.clickPrompt('Water Blast');
            this.player1.clickCard(this.vampireBatSwarm);
            // on destroy choices...
            expect(this.player2).toHavePrompt('Activate Swarm?: select dice');
            this.player2.clickDie(1);
            expect(this.vampireBatSwarm.location).toBe('play area');
            expect(this.vampireBatSwarm.damage).toBe(0);
            expect(this.vampireBatSwarm.exhausted).toBe(false);
            expect(this.vampireBatSwarm.isAttacker).toBe(false);
            expect(this.vampireBatSwarm.isDefender).toBe(false);
        });

        it('triggers during defence when destroyed. choose to swarm', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.vampireBatSwarm);
            this.player1.clickCard(this.ironWorker);
            this.player2.clickDone();
            this.player2.clickYes();
            // on destroy choices...
            expect(this.player2).toHavePrompt('Activate Swarm?: select dice');
            this.player2.clickDie(1);
            expect(this.vampireBatSwarm.location).toBe('play area');
            expect(this.vampireBatSwarm.damage).toBe(0);
            expect(this.vampireBatSwarm.exhausted).toBe(false);
            expect(this.vampireBatSwarm.isAttacker).toBe(false);
            expect(this.vampireBatSwarm.isDefender).toBe(false);
        });

        it('triggers when destroyed. choose not to swarm', function () {
            this.player1.clickCard(this.aradelSummergaard);
            this.player1.clickPrompt('Water Blast');
            this.player1.clickCard(this.vampireBatSwarm);
            // on destroy choices...
            expect(this.player2).toHavePrompt('Activate Swarm?: select dice');
            this.player2.clickPrompt('Cancel');
            expect(this.vampireBatSwarm.location).toBe('archives');
        });
    });

    describe('as attacker', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['vampire-bat-swarm', 'living-doll'],
                    dicepool: ['natural', 'ceremonial']
                },
                player2: {
                    phoenixborn: 'maeoni-viper',
                    inPlay: ['iron-worker'],
                    dicepool: ['natural', 'ceremonial']
                }
            });
            this.livingDoll.tokens.exhaustion = 1;
        });

        it('triggers during attack when destroyed. choose to swarm', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.ironWorker);
            this.player1.clickCard(this.vampireBatSwarm);
            this.player2.clickDone(); // guard
            this.player2.clickYes(); // counter
            // on destroy choices...
            expect(this.player1).toHavePrompt('Activate Swarm?: select dice');
            this.player1.clickDie(1);
            expect(this.vampireBatSwarm.location).toBe('play area');
            expect(this.vampireBatSwarm.damage).toBe(0);
            expect(this.vampireBatSwarm.exhausted).toBe(false);
            expect(this.vampireBatSwarm.isAttacker).toBe(false);
            expect(this.vampireBatSwarm.isDefender).toBe(false);
        });
    });
});
