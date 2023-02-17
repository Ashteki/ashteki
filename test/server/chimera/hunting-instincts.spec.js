describe('Hunting Instincts Reveal', function () {
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
                threatZone: ['hunting-instincts', 'rampage'],
                dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
            }
        });
    });

    it('puts card into play with 2 status', function () {
        expect(this.huntingInstincts.location).toBe('threatZone');
        this.player1.endTurn();
        // informs real player of behaviour roll
        expect(this.player2).toHavePrompt('Alerting opponent');
        this.player1.clickPrompt('Ok');

        expect(this.huntingInstincts.location).toBe('play area');
        expect(this.huntingInstincts.status).toBe(0);
    });
});
