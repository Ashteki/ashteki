describe('Alert counters', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['mist-spirit'],
                spellboard: ['summon-butterfly-monk']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['hammer-knight', 'iron-worker'],
                spellboard: [],
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                hand: ['anchornaut']
            }
        });
    });

    it('defender counters but is not exhausted', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.hammerKnight); // target
        this.player1.clickCard(this.mistSpirit); // single attacker
        this.player2.clickPrompt('Done'); // guard
        this.player2.clickPrompt('Yes'); // counter

        expect(this.mistSpirit.location).toBe('archives');
        expect(this.hammerKnight.exhausted).toBe(false);
    });

    it('PB blocker counters but is not exhausted', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.coalRoarkwin); // target
        this.player1.clickCard(this.mistSpirit); // single attacker
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.hammerKnight); // blocker
        this.player2.clickCard(this.mistSpirit);
        this.player2.clickPrompt('Done');

        expect(this.mistSpirit.location).toBe('archives');
        expect(this.hammerKnight.exhausted).toBe(false);
    });
});
