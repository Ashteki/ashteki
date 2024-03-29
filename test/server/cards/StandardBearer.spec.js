describe('standard bearer', function () {
    describe('single standard bearer', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['standard-bearer', 'mist-spirit', 'time-hopper', 'iron-worker'],
                    spellboard: ['summon-butterfly-monk']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['flute-mage'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'illusion', 'charm'],
                    hand: []
                }
            });
            this.standardBearer.tokens.status = 4;
        });

        it('adds 1 to an attacking unit for each status', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.coalRoarkwin); // target
            this.player1.clickCard(this.standardBearer);
            this.player1.clickCard(this.timeHopper);
            this.player1.clickCard(this.mistSpirit);
            this.player1.clickPrompt('Done'); // done for attackers
            expect(this.player1).not.toBeAbleToSelect(this.ironWorker); // cannot select attacking units
            this.player1.clickCard(this.mistSpirit);
            this.player1.clickCard(this.timeHopper);
            this.player1.clickDone();
            expect(this.timeHopper.attack).toBe(2);
            expect(this.mistSpirit.attack).toBe(2);
            this.player2.clickDone();
            this.player1.clickCard(this.standardBearer);
            this.player1.clickCard(this.timeHopper);
            this.player1.clickCard(this.mistSpirit);
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.coalRoarkwin.damage).toBe(5);
        });
    });

    describe('multiple standard bearer', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: [
                        'standard-bearer',
                        'standard-bearer',
                        'mist-spirit',
                        'time-hopper',
                        'iron-worker'
                    ],
                    spellboard: ['summon-butterfly-monk']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['flute-mage'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'illusion', 'charm'],
                    hand: []
                }
            });
            this.player1.inPlay[0].tokens.status = 2;
            this.player1.inPlay[1].tokens.status = 2;
        });

        it('adds 1 to a unit for each status', function () {
            this.player1.clickAttack(this.coalRoarkwin);
            this.player1.clickCard(this.player1.inPlay[0]);
            this.player1.clickCard(this.player1.inPlay[1]);
            this.player1.clickCard(this.mistSpirit);
            this.player1.clickPrompt('Done'); // done for attackers
            // choose onAttackers order
            this.player1.clickCard(this.player1.inPlay[0]);
            this.player1.clickCard(this.player1.inPlay[1]); // boost sb #2
            this.player1.clickDone();
            expect(this.player1.inPlay[1].attack).toBe(2);
            expect(this.mistSpirit.attack).toBe(1);
            this.player1.clickDone(); // skip second standard bearer
            this.player2.clickDone(); // blockers
            // resolve
            this.player1.clickCard(this.player1.inPlay[0]);
            this.player1.clickCard(this.player1.inPlay[1]);
            this.player1.clickCard(this.mistSpirit);
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.coalRoarkwin.damage).toBe(4);
        });
    });
});
