describe('Mind Maze', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['mist-spirit', 'blue-jaguar', 'anchornaut'],
                dicepool: ['natural', 'illusion', 'charm', 'charm'],
                spellboard: [],
                hand: ['close-combat', 'mind-maze']
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

    it('escape ability used by opponent', function () {
        this.player1.clickCard(this.mindMaze); // play card
        this.player1.clickPrompt('Play this alteration');
        this.player1.clickDie(0);
        this.player1.clickCard(this.ironWorker); // attach to ms

        this.player1.endTurn();
        this.player2.clickCard(this.mindMaze);
        this.player2.clickPrompt('Escape');
        this.player2.clickDie(0);
        this.player2.clickCard(this.moltenGold);

        expect(this.player2.dicepool[0].exhausted).toBe(true);
        expect(this.player2.actions.main).toBe(false);
        expect(this.player2.actions.side).toBe(0);

        expect(this.mindMaze.location).toBe('discard');
    });

    it('discards attached unit at end of round', function () {
        this.player1.clickCard(this.mindMaze); // play card
        this.player1.clickPrompt('Play this alteration');
        this.player1.clickDie(0);
        this.player1.clickCard(this.ironWorker); // attach to ms

        this.player1.endTurn();
        this.player2.endTurn();
        this.player1.endTurn();
        this.player1.clickPrompt('done');
        this.player2.clickPrompt('done');

        expect(this.mindMaze.location).toBe('discard');
        expect(this.ironWorker.location).toBe('discard');
    });
});
