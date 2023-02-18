describe('Chimera recovery phase', function () {
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
