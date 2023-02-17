describe('Chimera Setup', function () {
    beforeEach(function () {
        this.setupTest({
            mode: 'solo',
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['anchornaut'],
                spellboard: [],
                dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                hand: ['shatter-pulse', 'summon-iron-rhino']
            },
            player2: {
                dummy: true,
                phoenixborn: 'viros-s1',
                behaviour: 'viros-behaviour-1',
                ultimate: 'viros-ultimate-1',
                inPlay: [],
                deck: [],
                spellboard: [],
                threatZone: ['rampage', 'hunting-instincts'],
                dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
            }
        });
    });

    it('behaviour1 roll always puts leftmost threatzone aspect into play', function () {
        expect(this.rampage.location).toBe('threatZone');
        this.player1.endTurn();
        // informs real player of behaviour roll
        expect(this.player2).toHavePrompt('Alerting opponent');
        this.player1.clickPrompt('Ok');

        expect(this.rampage.location).toBe('play area');
    });
});
