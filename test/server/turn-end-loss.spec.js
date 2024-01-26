describe('Turn End Loss for Chess Clocks - OP v3', function () {
    describe('active player runs out of time', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['shadow-hound', 'mist-spirit'],
                    spellboard: ['hypnotize'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['call-upon-the-realms', 'molten-gold'],
                    deck: ['anchornaut', 'iron-worker', 'iron-worker']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut'],
                    spellboard: ['purge'],
                    discard: ['flute-mage'],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['shatter-pulse', 'summon-iron-rhino'],
                    deck: ['hammer-knight', 'iron-worker', 'iron-worker']
                }
            });
        });

        it('end of game on turn end', function () {
            expect(this.game.finishedAt).toBeUndefined();
            expect(this.game.winner).toBeUndefined();
            // chess clock runs out
            this.player1.player.outOfTime();
            this.player1.endTurn();
            expect(this.game.finishedAt).not.toBeUndefined();
            expect(this.game.winner).toBe(this.player2.player);
        });
    });
});
