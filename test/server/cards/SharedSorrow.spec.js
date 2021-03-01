describe('Shared Sorrow', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['living-doll'],
                spellboard: [],
                dicepool: ['natural', 'natural', 'sympathy', 'sympathy'],
                hand: ['shared-sorrow', 'iron-worker'],
                discard: ['molten-gold']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['hammer-knight'],
                spellboard: ['summon-butterfly-monk']
            }
        });
    });

    it('discard, tutor, damage', function () {
        expect(this.hammerKnight.damage).toBe(0);
        this.player1.play(this.sharedSorrow);
        this.player1.clickDie(0);
        this.player1.clickPrompt('Done');

        this.player1.clickCard(this.ironWorker); // discard from hand
        this.player1.clickCard(this.moltenGold); // return to hand
        this.player1.clickCard(this.hammerKnight); // damage to hammerknight
        expect(this.hammerKnight.damage).toBe(2);
        expect(this.moltenGold.location).toBe('hand');
        expect(this.ironWorker.location).toBe('discard');
    });
});
