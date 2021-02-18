describe('Fade away', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['mist-spirit', 'anchornaut'],
                dicepool: ['natural', 'illusion', 'charm', 'illusion'],
                spellboard: [],
                hand: ['fade-away']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['iron-worker', 'iron-rhino'],
                spellboard: ['summon-iron-rhino'],
                hand: []
            }
        });
    });

    it('destroys at end of round', function () {
        expect(this.game.round).toBe(1);

        this.player1.play(this.fadeAway, this.ironRhino); // attach to ms

        this.player1.clickPrompt('End Turn');
        // pass p2
        this.player2.clickPrompt('End Turn');

        // pass p1
        this.player1.clickPrompt('End Turn');
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Done');

        expect(this.game.round).toBe(2);
        expect(this.ironRhino.location).toBe('archives');
        expect(this.fadeAway.location).toBe('discard');
    });

    it('purges allies at end of round', function () {
        expect(this.game.round).toBe(1);

        this.player1.play(this.fadeAway, this.ironWorker); // attach to ms

        this.player1.clickPrompt('End Turn');
        // pass p2
        this.player2.clickPrompt('End Turn');

        // pass p1
        this.player1.clickPrompt('End Turn');
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Done');

        expect(this.game.round).toBe(2);
        expect(this.ironWorker.location).toBe('purged');
        expect(this.fadeAway.location).toBe('discard');
    });
});
