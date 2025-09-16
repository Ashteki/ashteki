describe('Paranoia Aspect', function () {
    describe('In Play', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm'],
                    hand: ['molten-gold', 'summon-iron-rhino', 'iron-worker']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['paranoia'],
                    spellboard: [],
                    threatZone: ['hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            this.player1.dicepool[2].level = 'basic';
        });

        it('prevents use of basic dice as option', function () {
            this.player1.play(this.ironWorker);
            expect(this.player1).toBeAbleToSelectDie(this.player1.dicepool[0]);
            expect(this.player1).toBeAbleToSelectDie(this.player1.dicepool[1]);
            expect(this.player1).not.toBeAbleToSelectDie(this.player1.dicepool[2]);
            this.player1.clickDie(2); // not registered
            expect(this.player1.player.promptState.selectedDice.length).toBe(0);
            this.player1.clickDie(0);
            this.player1.clickDie(1);
            this.player1.clickDone();

            expect(this.ironWorker.location).toBe('play area');
        });

        it('prevents play when only basic dice available', function () {
            this.player1.dicepool[1].level = 'basic';

            this.player1.clickCard(this.ironWorker);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('In Threat Zone', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm'],
                    hand: ['molten-gold', 'summon-iron-rhino', 'iron-worker']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: [],
                    spellboard: [],
                    threatZone: ['hunting-instincts', 'paranoia'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            this.player1.dicepool[2].level = 'basic';
        });

        it('no effect', function () {
            this.player1.dicepool[1].level = 'basic';

            this.player1.play(this.ironWorker);
            this.player1.clickDie(0);
            this.player1.clickDie(1);
            this.player1.clickDone();

            expect(this.ironWorker.location).toBe('play area');

            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
