describe('Chained Creations', function () {
    describe('Played', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['mist-spirit', 'blue-jaguar'],
                    dicepool: ['natural', 'divine', 'charm', 'charm'],
                    hand: ['chained-creations']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['masked-wolf', 'iron-worker', 'iron-rhino', 'salamander-monk-spirit'],
                    spellboard: [
                        'empower',
                        'summon-masked-wolf',
                        'summon-iron-rhino',
                        'summon-salamander-monk'
                    ]
                }
            });
        });

        it('destroys unit and exhaust ready spell', function () {
            this.player1.clickCard(this.chainedCreations); // play card
            this.player1.clickPrompt('Play this action');
            this.player1.clickDie(0);
            this.player1.clickPrompt('Done');

            this.player1.clickCard(this.maskedWolf); // destroy
            expect(this.player1).toBeAbleToSelect(this.summonMaskedWolf);
            expect(this.player1).not.toBeAbleToSelect(this.empower);
            expect(this.player1).not.toBeAbleToSelect(this.summonIronRhino);
            this.player1.clickCard(this.summonMaskedWolf); // exhaust

            expect(this.summonMaskedWolf.exhausted).toBe(true);
        });

        it('destroys unit and can exhaust an exhausted ready spell', function () {
            this.summonMaskedWolf.tokens.exhaustion = 1;
            expect(this.summonMaskedWolf.exhausted).toBe(true);

            this.player1.clickCard(this.chainedCreations); // play card
            this.player1.clickPrompt('Play this action');
            this.player1.clickDie(0);
            this.player1.clickPrompt('Done');

            this.player1.clickCard(this.maskedWolf); // destroy
            expect(this.player1).toBeAbleToSelect(this.summonMaskedWolf);
            expect(this.player1).not.toBeAbleToSelect(this.empower);
            expect(this.player1).not.toBeAbleToSelect(this.summonIronRhino);
            this.player1.clickCard(this.summonMaskedWolf); // exhaust

            expect(this.summonMaskedWolf.tokens.exhaustion).toBe(2);
        });


        it('destroys Monk Spirit and cannot exhaust ready spell', function () {
            this.player1.clickCard(this.chainedCreations); // play card
            this.player1.clickPrompt('Play this action');
            this.player1.clickDie(0);
            this.player1.clickPrompt('Done');

            this.player1.clickCard(this.salamanderMonkSpirit); // destroy
            expect(this.player1).not.toBeAbleToSelect(this.summonSalamanderMonk);
            this.player1.clickCard(this.summonSalamanderMonk);
            expect(this.summonSalamanderMonk.exhausted).toBe(false);
        });

        it('damage unit and NOT exhaust ready spell', function () {
            this.player1.clickCard(this.chainedCreations); // play card
            this.player1.clickPrompt('Play this action');
            this.player1.clickDie(0);
            this.player1.clickPrompt('Done');

            this.player1.clickCard(this.ironRhino); // does not destroy
            expect(this.ironRhino.damage).toBe(2);
            expect(this.player1).not.toBeAbleToSelect(this.summonMaskedWolf);
            expect(this.player1).not.toBeAbleToSelect(this.empower);
            expect(this.player1).not.toBeAbleToSelect(this.summonIronRhino);

            expect(this.summonMaskedWolf.exhausted).toBe(false);
        });
    });

    describe('vs Vampire bat swarm', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['mist-spirit', 'blue-jaguar'],
                    dicepool: ['natural', 'divine', 'charm', 'charm'],
                    hand: ['chained-creations']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['masked-wolf', 'iron-worker', 'iron-rhino', 'vampire-bat-swarm'],
                    spellboard: [
                        'empower',
                        'summon-masked-wolf',
                        'summon-iron-rhino',
                        'summon-vampire-bat-swarm'
                    ],
                    dicepool: ['ceremonial']
                }
            });
        });

        it('destroys VBS, no respawn, and exhaust ready spell', function () {
            this.player1.clickCard(this.chainedCreations); // play card
            this.player1.clickPrompt('Play this action');
            this.player1.clickDie(0);
            this.player1.clickPrompt('Done');

            this.player1.clickCard(this.vampireBatSwarm); // destroy
            this.player2.clickPrompt('Cancel');
            this.player1.clickCard(this.summonVampireBatSwarm); // exhaust

            expect(this.summonVampireBatSwarm.exhausted).toBe(true);
        });

        it('destroys unit, respawn, and exhaust ready spell', function () {
            this.player1.clickCard(this.chainedCreations); // play card
            this.player1.clickPrompt('Play this action');
            this.player1.clickDie(0);
            this.player1.clickPrompt('Done');

            this.player1.clickCard(this.vampireBatSwarm); // destroy
            this.player2.clickDie(0);
            this.player1.clickCard(this.summonVampireBatSwarm); // exhaust

            expect(this.summonVampireBatSwarm.exhausted).toBe(true);
        });
    });
});
