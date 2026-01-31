describe('Insatiable Aspect', function () {
    describe('Insatiable In Play', function () {
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
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['insatiable', 'hunting-instincts'],
                    spellboard: [],
                    threatZone: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            this.insatiable.tokens.status = 2;
            this.player2.dicepool.forEach((d) => (d.level = 'basic'));
        });

        it('phase 1 raises 1 die', function () {
            expect(this.insatiable.location).toBe('play area');
            this.player1.endTurn();

            expect(this.insatiable.status).toBe(1);

            expect(this.player2.dicepool.filter((d) => d.level === 'power').length).toBe(1);
            // then chimera attacks...
        });

        it('phase 2 raises 2 die', function () {
            this.player2.player.chimeraPhase = 2;
            expect(this.insatiable.location).toBe('play area');
            this.player1.endTurn();

            expect(this.insatiable.status).toBe(1);

            expect(this.player2.dicepool.filter((d) => d.level === 'power').length).toBe(2);
            // then chimera attacks...
        });
    });
});