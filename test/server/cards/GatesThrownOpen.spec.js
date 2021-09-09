describe('Gates Thrown Open', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['mist-spirit', 'iron-worker'],
                spellboard: ['summon-gilder', 'summon-gilder', 'summon-iron-rhino', 'empower'],
                dicepool: ['divine', 'illusion', 'illusion'],
                hand: ['gates-thrown-open']
            },
            player2: {
                phoenixborn: 'rin-northfell',
                inPlay: ['hammer-knight'],
                spellboard: [],
                hand: ['rins-fury'],
                dicepool: ['natural', 'natural']
            }
        });
        for (let s of this.player1.spellboard) {
            s.tokens.exhaustion = 1;
        }
    });

    it('removes an exhaustion from a ready spell in each spellboard slot', function () {
        expect(this.empower.exhausted).toBe(true);
        expect(this.summonIronRhino.exhausted).toBe(true);
        expect(this.player1.spellboard[0].exhausted).toBe(true);
        expect(this.player1.spellboard[1].exhausted).toBe(true);
        this.player1.play(this.gatesThrownOpen);

        // unexhaust one copy of each exhausted spell
        expect(this.empower.exhausted).toBe(false);
        expect(this.summonIronRhino.exhausted).toBe(false);
        expect(this.player1.spellboard[0].exhausted).toBe(false);
        expect(this.player1.spellboard[1].exhausted).toBe(true);
    });
});
