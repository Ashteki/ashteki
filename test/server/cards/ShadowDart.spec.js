describe('Shadow Dart', function () {
    describe('on attack', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'tash-cantasita',
                    inPlay: ['shadow-dart', 'mist-spirit'],
                    spellboard: ['summon-butterfly-monk'],
                    dicepool: ['charm', 'divine'],
                    hand: ['lethal-blade']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'iron-worker', 'gilder', 'biter'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['anchornaut']
                }
            });
        });

        it('cannot be blocked by units with attack greater than dart', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.coalRoarkwin); // pb target
            this.player1.clickCard(this.shadowDart); // single attacker
            this.player1.clickDone();
            expect(this.player2).not.toBeAbleToSelect(this.ironWorker);
            expect(this.player2).toBeAbleToSelect(this.anchornaut);
            this.player2.clickCard(this.ironWorker);
            this.player2.clickCard(this.shadowDart);
            this.player2.clickDone();
            expect(this.coalRoarkwin.damage).toBe(1); // no block
        });

        it('can be blocked by units with attack less than dart', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.coalRoarkwin); // pb target
            this.player1.clickCard(this.shadowDart); // single attacker
            this.player1.clickDone();
            this.player2.clickCard(this.anchornaut);
            this.player2.clickCard(this.shadowDart);
            this.player2.clickDone();
            expect(this.coalRoarkwin.damage).toBe(0); // blocked
            expect(this.anchornaut.location).toBe('discard');
        });

        it('cannot be guarded by units with attack greater than dart', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.anchornaut); // pb target
            this.player1.clickCard(this.shadowDart); // single attacker
            this.player2.clickCard(this.biter);

            expect(this.anchornaut.location).toBe('play area'); // blocked
            expect(this.player1).not.toHaveDefaultPrompt();
            this.player2.clickDone();
            this.player2.clickNo(); // counter
            expect(this.anchornaut.location).toBe('discard');
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('can be guarded by units with attack less than dart', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.anchornaut); // pb target
            this.player1.clickCard(this.shadowDart); // single attacker
            this.player2.clickCard(this.gilder);
            expect(this.anchornaut.location).toBe('play area'); // blocked
            expect(this.gilder.damage).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
