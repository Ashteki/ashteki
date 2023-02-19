describe('Chimera recovery phase', function () {
    describe('Player Prompts', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    spellboard: ['summon-butterfly-monk']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'viros-s1',
                    behaviour: 'viros-behaviour-1',
                    ultimate: 'viros-ultimate-1',
                    inPlay: [],
                    deck: [],
                    spellboard: [],
                    threatZone: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            this.player1.endTurn();
            // no threat to reveal, no units to attack should PASS chimera turn
        });

        it('should not prompt during recovery phase', function () {
            expect(this.player1).toHavePrompt('Select dice to keep');
            expect(this.player2).not.toHavePrompt('Select dice to keep');

            this.player1.clickDie(0);
            this.player1.clickDone();
            // next turn
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('Red Rains tokens', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    spellboard: ['summon-butterfly-monk']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'viros-s1',
                    behaviour: 'viros-behaviour-1',
                    ultimate: 'viros-ultimate-1',
                    inPlay: ['rampage'],
                    deck: [],
                    spellboard: [],
                    threatZone: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            this.rampage.tokens.exhaustion = 1; // should end turn
            this.player1.endTurn();
            // no threat to reveal, no unexhausted units to attack should PASS chimera turn
        });

        it('should place a RR token for each aspect in play', function () {
            // player 1 pin dice
            this.player1.clickDie(0);
            this.player1.clickDone();
            // recovery
            expect(this.virosS1.redRains).toBe(1);

            // next turn
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
