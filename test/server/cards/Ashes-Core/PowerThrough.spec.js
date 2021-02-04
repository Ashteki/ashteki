describe('Power Through', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['mist-spirit', 'blue-jaguar', 'anchornaut'],
                dicepool: ['divine', 'illusion', 'charm', 'charm'],
                spellboard: [],
                hand: ['close-combat', 'power-through']
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

    it('modifies card attack', function () {
        this.player1.clickCard(this.powerThrough); // play card
        this.player1.clickPrompt('Play this alteration');
        this.player1.clickCard(this.mistSpirit); // attach to ms

        expect(this.mistSpirit.attack).toBe(2);
    });

    it('deals Overkill 1 to PB', function () {
        this.player1.clickCard(this.powerThrough); // play card
        this.player1.clickPrompt('Play this alteration');
        this.player1.clickCard(this.mistSpirit); // attach
        expect(this.powerThrough.location).toBe('play area');
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.ironWorker);
        this.player1.clickCard(this.mistSpirit);
        this.player2.clickPrompt('Done'); // no guard
        this.player2.clickPrompt('No'); // no counter
        expect(this.ironWorker.location).toBe('discard');
        expect(this.coalRoarkwin.damage).toBe(1);
    });
});
