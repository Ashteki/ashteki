describe('Meteor action spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'odette-diamondcrest',
                inPlay: ['hammer-knight'],
                dicepool: ['divine', 'divine', 'divine', 'charm'],
                hand: ['meteor'],
                spellboard: ['chant-of-revenge']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['silver-snake', 'mist-spirit'],
                spellboard: []
            }
        });

        this.player1.dicepool[0].level = 'class';
    });

    it('damages all units in play plus one', function () {
        this.player1.clickCard(this.meteor);
        this.player1.clickPrompt('Play this action');
        // no click of dice - preselected
        this.player1.clickPrompt('Done');
        // one damage plus 2 lions used
        expect(this.hammerKnight.damage).toBe(2);
        expect(this.silverSnake.damage).toBe(2);
        expect(this.mistSpirit.location).toBe('archives');
    });

    it('damages all units in play plus two', function () {
        this.player1.clickCard(this.meteor);
        this.player1.clickPrompt('Play this action');
        this.player1.clickDie(0); // remove class
        this.player1.clickDie(2); // add power
        this.player1.clickPrompt('Done');
        // one damage plus 2 lions used
        expect(this.hammerKnight.damage).toBe(3);
        expect(this.silverSnake.damage).toBe(3);
        expect(this.mistSpirit.location).toBe('archives');
    });
});
