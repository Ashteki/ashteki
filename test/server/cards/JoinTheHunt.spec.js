describe('Join the Hunt', function () {
    describe('on my unit', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['mist-spirit', 'hammer-knight', 'anchornaut'],
                    dicepool: ['divine', 'illusion', 'sympathy', 'charm'],
                    spellboard: ['join-the-hunt'],
                    hand: ['close-combat']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker'],
                    spellboard: ['summon-iron-rhino'],
                    hand: ['molten-gold'],
                    dicepool: ['natural', 'natural', 'charm', 'charm']
                }
            });
        });

        it('gives group tactics 2 to myunit', function () {
            this.player1.clickCard(this.joinTheHunt); // play card
            this.player1.clickPrompt('Join the hunt');
            this.player1.clickCard(this.mistSpirit);
            expect(this.mistSpirit.hasKeyword('grouptactics')).toBe(true);
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.coalRoarkwin);
            this.player1.clickCard(this.mistSpirit);
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.anchornaut);
            this.player1.clickPrompt('Done');
            this.player1.clickYes();

            expect(this.mistSpirit.attack).toBe(3);
            // check opponent can block GT unit
            this.player2.clickCard(this.ironWorker);
            this.player2.clickCard(this.mistSpirit);
            this.player2.clickDone();
            this.player1.clickCard(this.mistSpirit);
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.anchornaut);
            expect(this.ironWorker.location).toBe('discard');
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('block other check', function () {
            this.player1.clickCard(this.joinTheHunt); // play card
            this.player1.clickPrompt('Join the hunt');
            this.player1.clickCard(this.mistSpirit);
            expect(this.mistSpirit.hasKeyword('grouptactics')).toBe(true);
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.coalRoarkwin);
            this.player1.clickCard(this.mistSpirit);
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.anchornaut);
            this.player1.clickPrompt('Done');
            this.player1.clickYes();

            expect(this.mistSpirit.attack).toBe(3);
            // check opponent can block non-GT unit
            this.player2.clickCard(this.ironWorker);
            this.player2.clickCard(this.anchornaut);
            this.player2.clickDone();
            this.player1.clickCard(this.mistSpirit);
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.anchornaut);
            expect(this.anchornaut.location).toBe('discard');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('on blood puppet', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker'],
                    spellboard: ['summon-blood-puppet'],
                    hand: ['molten-gold'],
                    dicepool: ['natural', 'natural', 'charm', 'ceremonial', 'ceremonial'],
                    archives: ['blood-puppet']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['mist-spirit', 'hammer-knight', 'anchornaut'],
                    dicepool: ['divine', 'illusion', 'sympathy', 'charm'],
                    spellboard: ['join-the-hunt'],
                    hand: ['close-combat']
                }
            });
        });

        it('gives group tactics 2', function () {
            this.player1.clickCard(this.summonBloodPuppet);
            this.player1.clickPrompt('summon blood puppet');
            this.player1.clickPrompt("Opponent's");
            // this.player1.clickCard(this.bloodPuppet);
            expect(this.bloodPuppet.location).toBe('play area');
            expect(this.bloodPuppet.controller.name).toBe(this.player2.name);
            this.player1.endTurn();

            this.player2.clickCard(this.joinTheHunt); // play card
            this.player2.clickPrompt('Join the hunt');
            this.player2.clickCard(this.bloodPuppet);
            this.player2.clickPrompt('Attack');
            this.player2.clickCard(this.coalRoarkwin);
            this.player2.clickCard(this.bloodPuppet);
            this.player2.clickCard(this.hammerKnight);
            this.player2.clickCard(this.anchornaut);
            this.player2.clickPrompt('Done');
            this.player2.clickYes();

            expect(this.bloodPuppet.attack).toBe(2);
        });
    });

    describe('on a unit with group tactics', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['mist-spirit', 'raptor-hatchling', 'anchornaut'],
                    dicepool: ['divine', 'illusion', 'sympathy', 'charm'],
                    spellboard: ['join-the-hunt'],
                    hand: ['close-combat']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker'],
                    spellboard: ['summon-iron-rhino'],
                    hand: ['molten-gold'],
                    dicepool: ['natural', 'natural', 'charm', 'charm']
                }
            });
        });

        it('gives group tactics 2 to myunit', function () {
            this.player1.clickCard(this.joinTheHunt); // play card
            this.player1.clickPrompt('Join the hunt');
            this.player1.clickCard(this.raptorHatchling);
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.coalRoarkwin);
            this.player1.clickCard(this.mistSpirit);
            this.player1.clickCard(this.raptorHatchling);
            this.player1.clickCard(this.anchornaut);
            this.player1.clickPrompt('Done');
            this.player1.clickYes();

            expect(this.raptorHatchling.attack).toBe(4);
        });
    });
});
