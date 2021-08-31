describe('Game Turns', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['shadow-hound', 'mist-spirit'],
                spellboard: ['hypnotize'],
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                hand: ['call-upon-the-realms', 'molten-gold']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['anchornaut'],
                spellboard: [],
                dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                hand: ['shatter-pulse', 'summon-iron-rhino']
            }
        });
    });

    it('gives each player turn 1 at the beginning of each round', function () {
        expect(this.game.round).toBe(1);
        expect(this.player1.turn).toBe(1);
        // P1 T1
        this.player1.play(this.callUponTheRealms);
        this.player1.clickDie(0);
        this.player1.clickPrompt('done');

        this.player1.endTurn();

        expect(this.player2.turn).toBe(1);
        this.player2.endTurn(); // first pass

        expect(this.player1.turn).toBe(2);
        this.player1.endTurn(); // second pass ends round

        this.player1.clickDone(); // pin dice
        this.player2.clickDone();
        this.player1.clickNo(); // discard cards
        this.player2.clickNo();

        // end round

        expect(this.game.round).toBe(2);
        expect(this.player2).toHaveDefaultPrompt();
        expect(this.player2.turn).toBe(1);

        this.player2.play(this.summonIronRhino);
        this.player2.endTurn();

        expect(this.player1.turn).toBe(1);
        this.player1.endTurn(); // pass
        expect(this.player2.turn).toBe(2);
    });
});
