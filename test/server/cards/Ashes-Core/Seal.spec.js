describe('Seal action spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['iron-rhino', 'mist-spirit'],
                dicepool: ['natural', 'illusion', 'charm', 'charm'],
                spellboard: ['summon-butterfly-monk'],
                hand: ['seal']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['anchornaut', 'iron-worker'],
                spellboard: ['summon-iron-rhino', 'summon-iron-rhino', 'chant-of-revenge']
            }
        });
    });

    it('exhausts chosen spell', function () {
        this.player1.clickCard(this.seal); // play seal
        this.player1.clickPrompt('Play this action');
        this.player1.clickCard(this.player2.spellboard[0]); // first summon spell

        expect(this.seal.location).toBe('discard');
        expect(this.player2.spellboard[0].exhausted).toBe(true);
        expect(this.player2.spellboard[1].exhausted).toBe(true);
        expect(this.chantOfRevenge.exhausted).toBe(false);
    });

    it('exhausts chosen exhausted spell', function () {
        this.player2.spellboard[0].exhaust();
        this.player1.clickCard(this.seal); // play seal
        this.player1.clickPrompt('Play this action');
        this.player1.clickCard(this.player2.spellboard[0]); // first summon spell

        expect(this.seal.location).toBe('discard');
        expect(this.player2.spellboard[0].tokens.exhaustion).toBe(2);
        expect(this.player2.spellboard[1].tokens.exhaustion).toBe(1);
        expect(this.chantOfRevenge.exhausted).toBe(false);
    });
});
