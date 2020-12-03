describe('Undying heart BUG', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'jessa-na-ni',
                inPlay: ['blood-shaman'],
                dicepool: ['natural', 'illusion', 'charm', 'natural'],
                spellboard: [],
                hand: ['undying-heart']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['iron-rhino'],
                spellboard: ['summon-iron-rhino'],
                hand: ['molten-gold'],
                dicepool: ['natural', 'natural', 'charm', 'charm']
            }
        });
    });

    it('returns destroyed blood shaman to hand after ATTACK', function () {
        this.player1.clickCard(this.undyingHeart); // play card
        this.player1.clickPrompt('Play this alteration');
        this.player1.clickCard(this.bloodShaman); // attach
        this.player1.clickPrompt('End Turn');

        this.player2.clickPrompt('Attack');
        this.player2.clickCard(this.bloodShaman);
        this.player2.clickCard(this.ironRhino);
        this.player1.clickPrompt('Done'); // no guard
        this.player1.clickPrompt('No'); // no counter
        expect(this.undyingHeart.location).toBe('discard');
        expect(this.bloodShaman.location).toBe('hand');
    });

    it('returns destroyed blood shaman to hand after MG', function () {
        this.player1.clickCard(this.undyingHeart); // play card
        this.player1.clickPrompt('Play this alteration');
        this.player1.clickCard(this.bloodShaman); // attach
        this.player1.clickPrompt('End Turn');

        this.player2.clickCard(this.moltenGold);
        this.player2.clickPrompt('Play this Action');
        this.player2.clickCard(this.bloodShaman);
        expect(this.undyingHeart.location).toBe('discard');
        expect(this.bloodShaman.location).toBe('hand');
    });
});
