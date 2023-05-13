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
                    behaviour: 'viros-behaviour',
                    ultimates: ['viros-ultimate-1', 'viros-ultimate-2', 'viros-ultimate-3'],
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
            expect(this.game.round).toBe(2);
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
                    behaviour: 'viros-behaviour',
                    ultimates: ['viros-ultimate-1', 'viros-ultimate-2', 'viros-ultimate-3'],
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
            expect(this.game.round).toBe(1);
            // player 1 pin dice
            this.player1.clickDie(0);
            this.player1.clickDone();
            // recovery
            expect(this.virosS1.redRains).toBe(1);

            // next turn
            expect(this.game.round).toBe(2);
        });

        it('should refill status tokens for each aspect in play', function () {
            this.rampage.tokens.status = 0;
            expect(this.rampage.status).toBe(0);
            expect(this.game.round).toBe(1);

            // player 1 pin dice
            this.player1.clickDie(0);
            this.player1.clickDone();
            // recovery makes status 2, then status effect and reroll makes -1, so 1
            expect(this.rampage.status).toBe(1);
            // next turn
            expect(this.game.round).toBe(2);
        });
    });
});
