describe('bypass', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['iron-rhino', 'mist-spirit'],
                spellboard: ['hypnotize'],
                dicepool: ['natural', 'natural', 'charm', 'charm']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['anchornaut', 'iron-worker'],
                spellboard: [],
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                hand: ['anchornaut']
            }
        });
    });

    it('prevents block', function () {
        this.player1.clickCard(this.hypnotize);
        this.player1.clickPrompt('Hypnotize a unit');
        this.player1.clickCard(this.ironRhino);
        expect(this.ironRhino.anyEffect('bypass')).toBe(true);

        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.coalRoarkwin); // target
        this.player1.clickCard(this.ironRhino);
        this.player1.clickPrompt('Done'); // single attacker
        expect(this.player2).not.toHavePrompt('Choose a blocker');
        expect(this.coalRoarkwin.damage).toBe(7);
    });

    it('prevents guard', function () {
        this.player1.clickCard(this.hypnotize);
        this.player1.clickPrompt('Hypnotize a unit');
        this.player1.clickCard(this.ironRhino);
        expect(this.ironRhino.anyEffect('bypass')).toBe(true);

        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.anchornaut); // target
        this.player1.clickCard(this.ironRhino);
        expect(this.player2).not.toHavePrompt('Choose a guard');
        expect(this.player2).toHavePrompt('Do you want to counter?');
    });
});
